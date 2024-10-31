/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../stores';
import { twMerge } from 'tailwind-merge'
import { Button, message, Modal } from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
import ImageCompare from './ImageCompare';
import ActionBar from './ActionBar';
import ProgressBar from './ProgressBar';
import PromptModal from './PromptModal';
import VideoPlayer from "./VideoPlayer";
import ResultTypeBar from './ResultTypeBar';
import { GetTaskService, UpdateTaskService, GetHistorysService, UpdateHistorysService } from '../services/global';
import SystemManager from '@/utils/System';
import ImageManager from '@/utils/Image';
import Locale from "@/locales"


type Result = {
  imageSrc: string
}

interface Props {
  file: File | undefined
  action: any
  setFile: (file: File | undefined) => void
  setAction: (data: any) => void,
  generateImage: (file: File, action: any) => Promise<Result>
  generateVideo: (url: string, payload: string) => Promise<any>
}

const ImageUpscaler: React.FC<Props> = ({ file, action, setFile, setAction, generateImage, generateVideo }) => {
  const globalState = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [src, setSrc] = useState<string | undefined>(undefined)
  const [newSrc, setNewSrc] = useState<string | undefined>(undefined)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [processing, setProcessing] = useState(false)
  const [finish, setFinish] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [contianerWidth, setcontainerWidth] = useState(1200)
  const [vidoeMaxWidth, setVideoMaxWidth] = useState(1200)
  const [maxSize, setMaxSize] = useState(16)
  const [prompt, setPrompt] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [resultTypeOptions, setResultTypeOptions] = useState(Locale.Action.ResultOptions)
  const [resultType, setResultType] = useState('image')
  const [videoSrc, setVideoSrc] = useState('')
  const [videoRatio, setVideoRatio] = useState(1)
  const [toggleHistory, setToggleHistory] = useState(false)

  const { confirm } = Modal;
  let tip = useRef(false)

  // init
  useEffect(() => {
    if (!file) return
    if (!tip.current) {
      tip.current = true
      const pixelM = file.size / (1024 * 1024)
      if (pixelM > 10) {
        onReset()
        showConfirm(Locale.System.ToLarge)
      }
    }

    const url = URL.createObjectURL(file)
    setSrc(url)
    const img = new Image()
    img.src = url
    img.onload = () => {
      setImage(img)
      if (img.width && img.height) {
        onSize(img.width, img.height)
        const scale = Number(img.height) / Number(img.width)
        if (scale > 1.6)
          return setcontainerWidth(400)
        if (scale > 1.4)
          return setcontainerWidth(500)
        if (scale > 1.2)
          return setcontainerWidth(600)
        if (scale > 1.0)
          return setcontainerWidth(700)
        if (scale > 0.8)
          return setcontainerWidth(800)
        if (scale > 0.6)
          return setcontainerWidth(1000)

      }
    }
  }, [])

  useEffect(() => {
    if (videoRatio > 1.5)
      return setVideoMaxWidth(1200)
    if (videoRatio > 1.4)
      return setVideoMaxWidth(1100)
    if (videoRatio > 1.3)
      return setVideoMaxWidth(900)
    if (videoRatio > 1.2)
      return setVideoMaxWidth(800)
    if (videoRatio > 1)
      return setVideoMaxWidth(700)
    if (videoRatio > 0.8)
      return setVideoMaxWidth(600)
    if (videoRatio > 0.6)
      return setVideoMaxWidth(500)
    setVideoMaxWidth(400)
  }, [videoRatio])

  const onSize = (width: number, height: number) => {
    let finalSize = 0
    const maxPixel = 4194304
    const sizes = [2, 4, 8, 16]
    sizes.forEach((size) => {
      if (width * size * height * size < maxPixel) {
        finalSize = size
      }
    })
    setMaxSize(finalSize)
  }

  const onReset = () => {
    UpdateTaskService({})
    setSrc(undefined)
    setFile(undefined)
    setProcessing(false)
  }

  const onResetVideo = () => {
    setProcessing(false)
  }

  const onStartGenerate = () => {
    const user = window.location.hostname.split('.')[0]
    if (['302aitool7', '302aitool7-restoration', '302tool5', '302tool5-restoration'].includes(user)) {
      return showUpsellConfirm()
    }
    setModalVisible(true)
  }

  const onReGenerate = () => {
    setModalVisible(true)
  }

  const onGenerateImage = async () => {
    if (!file) return
    setIsDone(false)
    setProcessing(true)
    generateImage(file, action)
      .then(
        (result) => {
          setIsDone(true)
          handleHistoryAdd({ ...action, image: result.imageSrc })
          UpdateTaskService({})
          messageApi.info(Locale.Action.DownloadImageTip);
          setTimeout(async () => {
            const localSrc = await ImageManager.localizeImage(result.imageSrc) as string
            setNewSrc(localSrc)
            setProcessing(false)
            setFinish(true)
          }, 600)
        },
        (e) => {
          throw e
        }
      )
      .catch((e) => {
        if (e.error) {
          const error = e.error.err_code + ''
          if (error === '-10001') {
            showConfirm(Locale.Code.TokenMiss)
          }
          else if (error === '-10002') {
            showConfirm(Locale.Code.TokenInvalid)
          }
          else if (error === '-10003') {
            showConfirm(Locale.Code.InternalError)
          }
          else if (error === '-10004') {
            showConfirm(Locale.Code.AccountOut)
          }
          else if (error === '-10005') {
            showConfirm(Locale.Code.TokenExpired)
          }
          else if (error === '-10006') {
            showConfirm(Locale.Code.TotalOut)
          }
          else if (error === '-10007') {
            showConfirm(Locale.Code.TodayOut)
          }
          else if (error === '-10012') {
            showConfirm(Locale.Code.HourOut, '-10012')
          }
        } else {
          const task = GetTaskService()
          if (task && task.id) {
            const content = `${Locale.Error.NetworkError} (${Locale.System.Task} ID: ${task.id})`
            showConfirm(content);
          } else {
            showConfirm(Locale.Error.NetworkError);
          }
        }
      })
  }

  const onGenerateVideo = (newSrc: string | undefined, payload: any) => {
    if (!newSrc) return
    setResultType('image')
    setIsDone(false)
    setProcessing(true)
    generateVideo(newSrc, payload)
      .then(
        (result) => {
          setIsDone(true)
          handleHistoryAdd({ ...action, video: result.video })
          UpdateTaskService({})
          messageApi.info(Locale.Action.DownloadVideoTip);
          setTimeout(() => {
            setVideoSrc(result.video)
            setVideoRatio(result.ratio)
            setResultType('video')
            setProcessing(false)
            setFinish(true)
          }, 600)
        },
        (e) => {
          throw e
        }
      )
      .catch((e) => {
        if (e.error) {
          const error = e.error.err_code + ''
          if (error === '-10001') {
            showConfirm(Locale.Code.TokenMiss)
          }
          else if (error === '-10002') {
            showConfirm(Locale.Code.TokenInvalid)
          }
          else if (error === '-10003') {
            showConfirm(Locale.Code.InternalError)
          }
          else if (error === '-10004') {
            showConfirm(Locale.Code.AccountOut)
          }
          else if (error === '-10005') {
            showConfirm(Locale.Code.TokenExpired)
          }
          else if (error === '-10006') {
            showConfirm(Locale.Code.TotalOut)
          }
          else if (error === '-10007') {
            showConfirm(Locale.Code.TodayOut)
          }
          else if (error === '-10012') {
            showConfirm(Locale.Code.HourOut, '-10012')
          }
          else if (error === '-10011') {
            showConfirm(Locale.Code.ErrorPrompt)
          }
        } else {
          const task = GetTaskService()
          if (task && task.id) {
            const content = `${Locale.Error.NetworkError} (${Locale.System.Task} ID: ${task.id})`
            showConfirm(content);
          } else {
            showConfirm(Locale.Error.NetworkError);
          }
        }
      })
  }

  // Prompt弹框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // Prompt弹框确认
  const handleModalSubmit = (values: any) => {
    setModalVisible(false);
    setResultType('image')
    setVideoSrc('')
    setPrompt(values.prompt)
    onGenerateVideo(newSrc, values)
  };

  // 保存记录
  const handleHistoryAdd = async (item: any) => {
    let history = { ...item, id: Date.now() }
    let historys = GetHistorysService();
    if (item.video) {
      const record = historys.pop()
      history = { ...record, ...history }
    }
    historys = [...historys, history];
    UpdateHistorysService(historys);
  };

  const onDownloadImage = () => {
    if (!newSrc) {
      return
    }
    const time = SystemManager.getNowformatTime()
    let resultName = `result-${time}.png`
    SystemManager.downloadImage(newSrc, resultName)
  }

  const onDownloadVideo = () => {
    if (!videoSrc) {
      return
    }
    const time = SystemManager.getNowformatTime()
    let resultName = `result-${time}.mp4`
    SystemManager.downloadVideo(videoSrc, resultName)
  }

  const showUpsellConfirm = () => {
    setProcessing(false);
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      content: <>
        <p>{Locale.System.Nosupport},</p>
        <p>{Locale.System.Visit}<a className="text-primary, underline" href={globalState.domain} target="_blank">302.AI</a>{Locale.System.Create}</p>
      </>,
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      ),
    });
  };

  const showConfirm = (content: string, code?: string) => {
    setProcessing(false);
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      content: <>
        <p>{content}</p>
        {code && code === '-10012'
          ?
          <p>
            {Locale.System.Visit}
            <a className="text-primary, underline" href={globalState.domain} target="_blank"> 302.AI </a>
            {Locale.System.Create}
          </p>
          :
          <p>{Locale.About.More}<a className="text-primary, underline" href={globalState.domain} target="_blank">302.AI</a></p>
        }
      </>,
      onOk() {
        if (newSrc) {
          onResetVideo();
        } else {
          onReset();
        }
      },
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      ),
    });
  };

  const showBackConfirm = () => {
    if (!processing) {
      onReset()
      return
    }
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      cancelText: Locale.System.Cancel,
      content: <>
        <p>{Locale.Action.Break}</p>
      </>,
      onOk() {
        onReset()
      },
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <div id="image-upscaler" className="flex w-full flex-col space-y-4 justify-center items-center">
      {
        src && <section className="show bg-base-200 flex flex-col w-full justify-center space-y-4" style={{ maxWidth: resultType === 'image' ? contianerWidth : vidoeMaxWidth }}>
          {
            newSrc && videoSrc && <div className='w-full'>
              {
                <ResultTypeBar showSize='middle' resultTypeOptions={resultTypeOptions} resultType={resultType} setResultType={setResultType} />
              }
            </div>
          }
          <div className="flex w-full items-center justify-center overflow-hidden">
            <div
              className={twMerge(
                'relative w-full transition-all duration-700',
                processing ? 'translate-y-2' : ''
              )}
            >
              {
                newSrc ? <img
                  className={twMerge(
                    'w-full rounded-md transition-all duration-700',
                    !processing ? 'hidden' : '',
                  )}
                  src={newSrc}
                  alt="upscaler image"
                /> : <img
                  className={twMerge(
                    'w-full rounded-md transition-all duration-700',
                  )}
                  src={src}
                  alt="upscaler image"
                />
              }

              {
                !processing && newSrc && resultType === 'image' && <div className='result w-full'>
                  <ImageCompare
                    beforeSrc={src}
                    afterSrc={newSrc}
                    initPosition={20}
                  />
                </div>

              }
              {
                videoSrc && resultType === 'video' && <div className='w-full rounded-xl overflow-hidden' style={{ background: 'rgb(245, 245, 245, 0.6)' }}>
                  <VideoPlayer
                    url={videoSrc}
                    width="100%"
                    height="auto"
                  />
                </div>
              }

              <div
                className={twMerge(
                  'scan absolute top-0 transition-all duration-200',
                  'pointer-events-none',
                  processing ? '' : 'opacity-0'
                )}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              ></div>
            </div>
          </div>
        </section>

      }

      <section className="w-full max-w-[900px]">
        {
          !finish && <div className='flex-1 lg:hidden mb-4'>
            {
              processing
                ? <ProgressBar seconds={120} finish={isDone} />
                : <ActionBar action={action} setAction={setAction} maxSize={maxSize} />
            }
          </div>

        }

        <div className="w-full flex justify-between items-center space-x-2">
          <Button
            type='primary'
            ghost
            className="btn"
            onClick={showBackConfirm}>
            {Locale.System.Back}
          </Button>

          {
            !newSrc && !videoSrc && !finish && <div className='flex-1 hidden lg:block'>
              {
                processing
                  ? <ProgressBar seconds={120} finish={isDone} />
                  : <ActionBar action={action} setAction={setAction} maxSize={maxSize} />
              }
            </div>

          }

          {
            newSrc && !videoSrc && <div className='flex-1 hidden lg:block w-full'>
              {
                processing
                  ? <div className='relative w-full'>
                    <ProgressBar seconds={60 * 20} finish={isDone} />
                    <p className="w-full text-center absolute text-sm">{Locale.Action.WaitVideo}</p>
                  </div>
                  : <div className='w-full flex justify-center'>
                    <Button type='primary' style={{ background: '#407df1' }} onClick={onStartGenerate}>{Locale.Action.CreatVideo}</Button>
                  </div>
              }
            </div>
          }

          {
            newSrc && videoSrc && resultType === 'video' && <div className='flex-1 flex justify-center'>
              <Button type='primary' style={{ background: '#407df1' }} onClick={onReGenerate} >{Locale.Action.ReGenerateVideo}</Button>
            </div>
          }


          {

            !finish
              ? <Button disabled={!!processing} type='primary' onClick={onGenerateImage}>{Locale.System.Start}</Button>
              : resultType === 'image'
                ? <Button type='primary' onClick={onDownloadImage}>{Locale.Action.DownloadImage}</Button>
                : <Button type='primary' onClick={onDownloadVideo}>{Locale.Action.DownloadVideo}</Button>
          }

        </div>
      </section>

      <section>
        {modalVisible && <PromptModal
          visible={modalVisible}
          src={newSrc}
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
        />}
      </section>
      <>
        {contextHolder}
      </>
    </div >
  )
}

export default ImageUpscaler
