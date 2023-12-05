"use client";

import PrositContext from "@/components/prositContext";
import React, {useContext, useEffect, useRef} from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./editor"), {
	ssr: false,
});

export default function Retour() {
	const { prosit, setProsit } = useContext(PrositContext);
	const [data, setData] = React.useState();


	const ref = useRef(null)

	return (<> <Editor
		data={data}
		onChange={setData}
		holder="editorjs-container"
	/> </>)

		}
