/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react'
import { UploadOutlined } from "@ant-design/icons";
import { twMerge } from 'tailwind-merge'
import DropZone from './DropZone'
import ActionBar from './ActionBar';
import Example from './Example';
import Locale from "../locales";

const ALLOWED_FILES = ['image/png', 'image/jpeg']

interface LandingProps {
  file: File | undefined
  setFile: (file: File | undefined) => void
  action: any,
  setAction: (data: any) => void,
  data: any
}

export default function Landing({ file, setFile, action, setAction, data }: LandingProps) {
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const handleFilesSelected = useCallback((files: FileList | Array<File>) => {
    const file = Array.from(files).filter((file) =>
      ALLOWED_FILES.includes(file.type)
    )[0]

    if (file) {
      setFile(file)
    }
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }, [])

  const [dragging, setDragging] = useState(false)
  const handleDragging = useCallback((dragging: boolean) => {
    setDragging(dragging)
  }, [])

  useEffect(() => {
    if (action.scale < 2) {
      setAction((preActions: any) => { return { ...preActions, scale: 2 } });
    }
  }, [action, setAction])

  return (
    <div className="flex w-full flex-col items-center space-y-4 max-w-[800px]">
      <section className="bg-[#7728f5] opacity-60 hover:opacity-40 overflow-hidden rounded-3xl p-6 w-full">
        <DropZone
          onDrop={(files: any) => handleFilesSelected(files)}
          onDrag={handleDragging}
        >
          <div
            className='flex rounded-2xl flex-col items-center justify-center border-4 border-dashed border-gray-100 px-4 py-6 text-center sm:py-8 cursor-pointer'
            onClick={() => inputFileRef.current?.click()}
          >
            <UploadOutlined className='text-5xl text-bold text-white' style={{ color: 'white' }} />
            <p className="text-sm text-white mx-16 mt-4 text-center font-bold opacity-100">
              {Locale.Action.DropIn}
            </p>
            <input
              type="file"
              ref={inputFileRef}
              className={twMerge(
                'absolute bottom-0 left-0 right-0 top-0',
                'hidden'
              )}
              accept={ALLOWED_FILES.join(',')}
              onChange={(ev) =>
                handleFilesSelected(ev.currentTarget.files ?? [])
              }
            />
          </div>
        </DropZone>
      </section>

      <section className='w-full max-w-[700px]'>
        <ActionBar action={action} setAction={setAction} maxSize={8} />
      </section>

      <section className='w-full'>
        <div className='py-16'></div>
        <Example setFile={setFile} setAction={setAction} />
      </section>

    </div>
  )
}
