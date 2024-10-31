import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ImageCompare from './ImageCompare';
import Locale from "@/locales"
import ImageManager from '@/utils/Image';

interface ExampleProps {
  setFile: (file: File | undefined) => void
  setAction: (data: any) => void,
}

export default function Example({ setFile, setAction }: ExampleProps) {
  const [tabIndex, SetTabIndex] = useState(0)
  const EXAMPLE_DATA = Locale.Example

  const handlerTryExample = async () => {
    const img = EXAMPLE_DATA.demos[tabIndex].before
    const file = await ImageManager.imageToFile(img) as File
    setFile(file)
    // 0=enlarge,1=ehhance,2=colorize
    if (tabIndex === 0) {
      setAction((preAction: any) => { return { ...preAction, character: false, color: false, colorV2: false } })
    }
    if (tabIndex === 1) {
      setAction((preAction: any) => { return { ...preAction, character: true, color: false, colorV2: false } })
    }
    if (tabIndex === 2) {
      setAction((preAction: any) => { return { ...preAction, character: false, color: true, colorV2: false } })
    }
  }

  return (
    <div id="example" className="w-full flex items-center pt-1 flex-col space-y-4">
      <h2 className='class="text-3xl sm:text-4xl font-secondary text-gray-800 uppercase text-center w-full"'>
        {EXAMPLE_DATA.title}
      </h2>
      <div role="tablist" className="flex justify-around space-x-2">
        {EXAMPLE_DATA.demos.map((it, i) => (
          <div
            role="tab"
            className={twMerge(' border-[1px] border-solid border-[#7728f5] rounded-2xl p-1 px-3 text-[#7728f5] opacity-80 text-sm cursor-pointer', tabIndex == i ? 'bg-[#7728f5] text-[#fff]' : '')}
            key={i}
            onClick={() => SetTabIndex(Number(i))}
          >
            {it.title}
          </div>
        ))}
      </div>
      <div className="compare">
        {EXAMPLE_DATA.demos.map((it, i) => (
          <div
            role="tab"
            className={twMerge(
              'flx jutify-center w-full',
              tabIndex == i ? '' : 'hidden'
            )}
            key={i}
          >
            <div className=" flex w-full justify-center">
              <ImageCompare
                beforeSrc={it.before}
                afterSrc={it.after}
                initPosition={30}
              />
            </div>
            <div className="mt-2 text-sm font-medium text-justify hidden md:block md:text-center px-2 text-slate-500">{it.desc}</div>
          </div>
        ))}
      </div>
      <div className="action">
        <div
          className={twMerge(' border-[1px] border-solid border-[#7728f5] rounded-xl py-2 px-3 text-white opacity-80 text-sm cursor-pointer bg-[#7728f5]')}
          onClick={handlerTryExample}
        >
          {EXAMPLE_DATA.action}
        </div>
      </div>
    </div>
  )
}
