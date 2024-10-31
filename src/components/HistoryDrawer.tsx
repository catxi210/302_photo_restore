import { Modal, Card, Button, Popconfirm } from "antd";
import { GetHistorysService, UpdateHistorysService } from "@/services/global";
import Image from "next/image";

import {
	ClearOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import SystemManager from "@/utils/System";
import ImageManager from "@/utils/Image";
import Locale from "../locales";

export default function HistoryDrawer(props: {
	title: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [showList, setShowList] = useState<any[]>([]);

	const onDownloadImage = async (src: string) => {
		if (!src) {
			return
		}
		const file = await ImageManager.imageToFile(src)
		const localUrl = URL.createObjectURL(file as File);
		const time = SystemManager.getNowformatTime()
		let resultName = `result-${time}.png`
		SystemManager.downloadImage(localUrl, resultName)
	}

	const onDownloadVideo = (src: string) => {
		if (!src) {
			return
		}
		const time = SystemManager.getNowformatTime()
		let resultName = `result-${time}.mp4`
		SystemManager.downloadVideo(src, resultName)
	}

	const cleanHistory = () => {
		setShowList([]);
		UpdateHistorysService([])
	}

	useEffect(() => {
		let historys = GetHistorysService();
		setShowList(historys.reverse());
	}, [props.isOpen]);

	return (
		<>
			<Modal
				title={props.title}
				open={props.isOpen}
				onCancel={props.onClose}
				footer={null}
				width={580}
			>
				<div className="flex w-full mt-2 justify-between items-center">
					<span className="text-sm text-[#bbb]">{Locale.History.ItemCount(showList.length)}</span>
					<div className="flex space-x-2">
						<Popconfirm
							title={Locale.History.ClearAll}
							description={Locale.History.ClearAllSure}
							onConfirm={() => cleanHistory()}
							okText={Locale.History.Clear}
							cancelText={Locale.History.NotNow}
							placement="bottom"
						>
							<Button
								size="middle"
								shape="circle"
								icon={<ClearOutlined />}
							></Button>
						</Popconfirm>
					</div>

				</div>
				<div className="mt-4 flex flex-wrap w-full h-[500px] sm:h-[600px] overflow-y-scroll my-scroll overflow-x-hidden">
					<div className="w-full space-y-4">
						{
							showList.map((it, index) => (
								<div key={index} className="flex w-full relative">
									<Card
										className="w-full bg-[#F7F7F9] relative overflow-hidden"
										actions={[
											<Button
												key="image"
												type="primary"
												disabled={!it.image}
												onClick={() => onDownloadImage(it.image)}
											>
												{Locale.Action.DownloadImage}
											</Button>,
											<Button
												key="video"
												type="primary"
												disabled={!it.video}
												style={{ background: it.video ? '#407df1' : "#dedede" }}
												onClick={() => onDownloadVideo(it.video)}
											>
												{Locale.Action.DownloadVideo}
											</Button>
										]}
									>
										{it.image &&
											<div className="rounded-sm overflow-hidden w-[100px]">
												<Image width={20} height={20} style={{ width: '100%', height: 'auto' }} alt={"result image"} src={it.image} className="rounded-sm " />
											</div>
										}
										<div className="absolute top-0 right-0 p-2 text-slate-400">
											{SystemManager.formatTimestamp(it.id)}
										</div>
									</Card>
								</div>
							))
						}
					</div>
				</div>
			</Modal>
		</>
	);
}
