import { Button, ConfigProvider, Space } from 'antd';
import "../globals.css";

export default function TranslaterLayout(props: { children: any }) {
	return (
		<ConfigProvider
			theme={{
				"token": {
					"colorPrimary": "#7728f5",
					"colorInfo": "#7728f5",
				}
			}}
		>
			<div
				id="translator-layout"
				className=' relative flex h-screen flex-col pt-6 sm:p-12 bg-[#f5f5f5] h-100vh w-full'>
				{props.children}
			</div>
		</ConfigProvider>

	);
}
