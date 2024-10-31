"use client";
import 'whatwg-fetch'
import { AppContext } from '@/stores';
import { useState, useEffect } from "react";
import { HistoryOutlined, } from "@ant-design/icons";
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import { GLOBAL_INTERNATIONAL_DATA } from "@/constans";

import PageLoading from '@/components/PageLoading';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import LangMenu from "@/components/LangMenu";
import ImageUpscaler from "@/components/ImageUpscaler";
import Landing from "@/components/Landing";
import HistoryDrawer from '@/components/HistoryDrawer';

import { UpdateLocalAuthDataService } from "../../services/global";
import { generateImage, generateVideo } from "@/services/photo-restore";

import Locale from "../../locales";
import "../globals.css";


export default function TranslaterPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [globalState] = useState(GLOBAL_INTERNATIONAL_DATA);
	const [toggleHistory, setToggleHistory] = useState(false)
	const [initData] = useState<any>(null)
	const [file, setFile] = useState<File | undefined>()
	const [actionData, setActionData] = useState({
		scale: 2,
		character: false,
		color: false, // fast
		colorV2: false, // low
	});

	// Set API-Key
	useEffect(() => {
		const apiKey = process.env.NEXT_PUBLIC_API_KEY
		if (apiKey) {
			UpdateLocalAuthDataService({ key: apiKey })
		} else {
			console.error("Miss 302 API-Key!")
		}
		setIsLoading(false)
	}, [])

	if (isLoading) return <PageLoading />

	return (
		<AppContext.Provider value={globalState}>
			<StyleProvider layer hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
				<div className="flex w-full flex-col">
					<Header />
					<div id="tanslator-container" className="flex w-full justify-center sm:mt-6">
						<div className="w-full flex flex-col  p-4 sm:p-6 justify-center max-w-[1280px] relative">
							<div className="fixed right-4 top-4">
								<div className="flex items-center space-x-2">
									<LangMenu />
									<HistoryOutlined
										className="my-button my-icon"
										onClick={() => setToggleHistory(true)}
									/>
								</div>
							</div>
							<div className="w-full">
								<div className="flex w-full flex-col items-center">
									{file ? (
										<ImageUpscaler
											file={file}
											setFile={setFile}
											action={actionData}
											setAction={setActionData}
											generateImage={generateImage}
											generateVideo={generateVideo}
										/>
									) : (
										<Landing
											file={file}
											setFile={setFile}
											data={initData}
											action={actionData}
											setAction={setActionData}
										/>
									)}
								</div>
							</div>
						</div>

						<HistoryDrawer
							title={Locale.History.Title}
							isOpen={toggleHistory}
							onClose={() => setToggleHistory(false)}
						/>

					</div >
					<Footer />
				</div>
			</StyleProvider>
		</AppContext.Provider>
	);
}
