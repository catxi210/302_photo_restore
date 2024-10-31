import 'whatwg-fetch'
import { VIDEO_PROMPT } from "@/constans"
import SystemManager from "@/utils/System"
import ImageManager from '@/utils/Image'
import { uploadImage, aiImageToText, aiTranslate } from './global'
import { GetLocalAuthDataService, GetTaskService, UpdateTaskService } from "./global"

type Result = {
  imageSrc: string
}


// Polling Task Result
async function fetchImageTask(id: string) {
  const authData = await GetLocalAuthDataService();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const maxAttempts = 30;

    const fetchApi = (id: string) => {
      fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/task/${id}/fetch
      `, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(data.error)
            return
          }
          if (data.status === 'succeeded') {
            resolve(data);
          } else {
            if (counter < maxAttempts) {
              counter++;
              const task = GetTaskService()
              if (task.id) {
                setTimeout(() => fetchApi(id), 5000); // 每隔5秒轮询一次
              }
            } else {
              reject("Max attempts reached");
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    };
    fetchApi(id);
  });
}


// Helper Function to Handle Fetch Requests
async function fetchWithAuthorization(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
}

// Helper Function to Create FormData
function createFormData(entries: Record<string, any>): FormData {
  const formData = new FormData();
  for (const key in entries) {
    formData.append(key, entries[key]);
  }
  return formData;
}

// Main Function to Generate an Image
export async function generateImage(file: File, action: any): Promise<Result> {
  try {
    // Choose the appropriate upscale function
    let res: any = action.character ? await upscaleFace(file, action) : await upscaleImageV1(file, action);

    // Apply colorization if needed
    if (action.color || action.colorV2) {
      const colorizeFunction = action.color ? colorizeImage : colorizeImageV2;
      res = await colorizeFunction(res.output);
    }

    // Return the final image source
    return { imageSrc: res.output };
  } catch (error) {
    throw new Error(`Image generation failed: ${error}`);
  }
}

// Function to Upload and Optionally Upscale Image
export async function upscaleImageV1(file: File, action: any): Promise<any> {
  try {
    const url = await uploadImage(file);
    if (action.scale === 0) return { output: url };

    const authData = await GetLocalAuthDataService();
    const options = {
      method: 'POST',
      body: JSON.stringify({
        image: url,
        scale: action.scale,
        face_enhance: true,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authData.key}`,
      },
    };

    const result = await fetchWithAuthorization(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/upscale`, options);
    UpdateTaskService(result);
    return result.output ? result : { output: url };
  } catch (error) {
    return Promise.reject(error);
  }
}

// Function to Upscale Faces in the Image
export async function upscaleFace(file: File, action: any): Promise<any> {
  try {
    const authData = await GetLocalAuthDataService();

    const formData = createFormData({
      input: file,
      image: file,
      ...(action.scale > 0 && { upscale: action.scale }),
    });

    const result = await fetchWithAuthorization(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/face-upscale`, {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${authData.key}`,
      },
    });

    UpdateTaskService(result);
    return result.output ? result : await fetchImageTask(result.id);
  } catch (error) {
    return Promise.reject(error);
  }
}

// Function to Colorize Image Using v1
export async function colorizeImage(url: string): Promise<any> {
  return processColorization(url, `${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/colorize`);
}

// Function to Colorize Image Using v2
export async function colorizeImageV2(url: string): Promise<any> {
  return processColorization(url, `${process.env.NEXT_PUBLIC_FETCH_API_URL}/302/submit/colorize-v2`, { model_name: "Artistic" });
}

// Generic Function to Process Colorization Tasks
async function processColorization(url: string, fetchUrl: string, additionalData: Record<string, string> = {}) {
  try {
    const authData = await GetLocalAuthDataService();
    const formData = createFormData({ image: url, ...additionalData });

    const result = await fetchWithAuthorization(fetchUrl, {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${authData.key}`,
      },
    });

    UpdateTaskService(result);
    return result.output ? result : await fetchImageTask(result.id);
  } catch (error) {
    return Promise.reject(error);
  }
}


// Create Video
export async function generateVideo(src: string, payload: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let result = { video: '', ratio: payload.ratio };
      let local = src;

      // Convert canvas to data URL if present
      if (payload.canvas) {
        local = payload.model === 'runway'
          ? (await ImageManager.resetSizeCanvas(payload.canvas, { width: 1280, height: 768 })).toDataURL()
          : payload.canvas.toDataURL();
      }

      // Convert image URL to file
      const file = await ImageManager.imageToFile(local) as File;
      let prompt = await processPrompt(payload.prompt);

      // Select video generation model
      switch (payload.model) {
        case 'luma':
          const url = await uploadImage(file);
          prompt = prompt || await aiImageToText(url, VIDEO_PROMPT);
          result.video = (await getLumaVideo(url, prompt)).output;
          break;
        case 'kling':
          result.video = (await getKlingVideo(file, payload.label, prompt)).output;
          break;
        case 'runway':
          result.video = (await getRunwayVideo(file, prompt)).output;
          break;
        default:
          throw new Error('Unknown model type');
      }

      // Resolve or reject based on result
      result.video ? resolve(result) : reject('Create image error!');
    } catch (error) {
      reject(error);
    }
  });
}

// Process prompt with optional translation
async function processPrompt(prompt: string): Promise<string> {
  if (prompt && SystemManager.containsChinese(prompt)) {
    return await aiTranslate(prompt);
  }
  return prompt;
}

// Unified fetch task function to avoid redundant code
async function fetchVideoTask(apiUrl: string, id: string, dataParser: (data: any) => any, resolve: Function, reject: Function) {
  const authData = await GetLocalAuthDataService();
  let counter = 0;
  const maxAttempts = 120;

  const fetchApi = async () => {
    try {
      const response = await fetch(`${apiUrl}/${id}/fetch`, {
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      });
      const data = await response.json();
      const result = dataParser(data);

      if (result) {
        resolve(result);
      } else if (counter < maxAttempts) {
        counter++;
        const task = GetTaskService();
        if (task.id) setTimeout(fetchApi, 10000);
      } else {
        reject("Max attempts reached");
      }
    } catch (error) {
      reject(error);
    }
  };
  fetchApi();
}

// Functions for different models
export async function getLumaVideo(url: string, prompt: string): Promise<any> {
  return generateVideoRequest(
    'luma/submit',
    'luma/task',
    (result) => result.video,
    {
      formData: { 'user_prompt': prompt, 'image_url': url },
      taskIdParser: (result) => result.id
    }
  );
}

export async function getKlingVideo(file: File, ratio: string, prompt: string): Promise<any> {
  return generateVideoRequest(
    'klingai/m2v_img2video',
    'klingai/task',
    (result) => result.data.works[0]?.resource.resource,
    {
      formData: {
        "input_image": file,
        "prompt": prompt,
        "negative_prompt": "",
        "cfg": "0.5",
        "aspect_ratio": ratio,
        "camera_type": "zoom",
        "camera_value": "-5",
      },
      taskIdParser: (result) => result.data.task.id
    }
  );
}

export async function getRunwayVideo(file: File, prompt: string): Promise<any> {
  return generateVideoRequest(
    'runway/submit',
    'runway/task',
    (result) => result.task.artifacts[0]?.url,
    {
      formData: {
        "init_image": file,
        "text_prompt": prompt,
        "seconds": "5",
        "seed": "",
      },
      taskIdParser: (result) => result.task.id
    }
  );
}

// Helper function for generating video requests
async function generateVideoRequest(submitUrl: string, taskUrl: string, dataParser: (data: any) => any, options: { formData: Record<string, any>, taskIdParser: (result: any) => string }) {
  return new Promise(async (resolve, reject) => {
    try {
      const authData = await GetLocalAuthDataService();
      const formData = new FormData();
      for (const key in options.formData) {
        formData.append(key, options.formData[key]);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/${submitUrl}`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${authData.key}`,
        },
      });

      if (!res.ok) throw await res.json();
      const result = await res.json();
      UpdateTaskService(result);

      const videoOutput = dataParser(result);
      if (videoOutput) {
        resolve({ output: videoOutput });
      } else {
        await fetchVideoTask(`${process.env.NEXT_PUBLIC_FETCH_API_URL}/${taskUrl}`, options.taskIdParser(result), dataParser, resolve, reject);
      }
    } catch (error) {
      reject(error);
    }
  });
}
