import type { RadioChangeEvent } from 'antd';
import { Radio, Switch } from 'antd';
import Locale from "../locales";

interface ActionProps {
  maxSize: number,
  action: any,
  setAction: (data: any) => void,
}

export default function ActionBar({ action, setAction, maxSize }: ActionProps) {

  const scaleOptions = [
    { label: 'x2', value: 2, disabled: false },
    { label: 'x4', value: 4, disabled: false },
    { label: 'x8', value: 8, disabled: false },
  ];

  const onChangeSize = ({ target: { value } }: RadioChangeEvent) => {
    setAction((preActions: any) => { return { ...preActions, scale: value } });
  };

  const onChangeCharacer = (checked: boolean) => {
    setAction((preActions: any) => { return { ...preActions, character: checked } });
  };

  const onChangeColor = (checked: boolean) => {
    if (checked) {
      setAction((preActions: any) => { return { ...preActions, colorV2: false } });
    }
    setAction((preActions: any) => { return { ...preActions, color: checked } });
  };

  const onChangeColorV2 = (checked: boolean) => {
    if (checked) {
      setAction((preActions: any) => { return { ...preActions, color: false } });
    }
    setAction((preActions: any) => { return { ...preActions, colorV2: checked } });
  };

  return (
    <div id="action-bar" className="w-full flex space-x-0 md:space-x-4 flex-col py-4 md:py-0 md:flex-row justify-between px-4 bg-[#7728f51c] rounded-3xl text-sm text-slate-500">
      <div className="flex space-x-2 items-center justify-between">
        <span>{Locale.Action.Enlarge}: </span>
        <Radio.Group
          size='small'
          options={scaleOptions}
          onChange={onChangeSize}
          value={action.scale}
          optionType="button"
          buttonStyle="solid"
        />

      </div>
      <div className="right w-full sm:flex-1 flex justify-between py-2 flex-col space-y-2 md:space-y-0 md:flex-row">
        <div className="space-x-2 flex items-center justify-between">
          <span className=''>{Locale.Action.Enhance}: </span>
          <Switch
            value={action.character}
            onChange={onChangeCharacer}
          />
        </div>
        <div className="space-x-2 flex items-center justify-between">
          <span className=''>{Locale.Action.Colorize}: </span>
          <Switch
            value={action.color}
            onChange={onChangeColor}
          />
        </div>
        <div className="space-x-2 flex items-center justify-between">
          <span className=''>{Locale.Action.ColorizeV2}: </span>
          <Switch
            value={action.colorV2}
            onChange={onChangeColorV2}
          />
        </div>
      </div>
    </div>
  )
}
