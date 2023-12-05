"use client";

import PrositContext from "@/components/prositContext";
import React, {useContext, useEffect, useRef} from "react";
import EditorJS from '@editorjs/editorjs'
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from "@editorjs/list";
import ImageTool from '@editorjs/image';


const initEditor = () => {

	const editor = new EditorJS({
		holder: 'editorjs',
		tools: {
			header: {
				inlineToolbar: true,
				class:
					Header,
				config: {
					placeholder: 'Entrez un titre',
					levels: [1, 2, 3, 4],
					defaultLevel: 3
				},
				toolbox: [
					{
						title: 'grqnd titre',
						icon: "h1",
						data: {
							level: 2
						}
					},{
						title: 'petit titre',
						icon: 'h2',
						data: {
							level: 5
						}
					}
				]
			},
			list: {
				class: List,
				inlineToolbar: true,
				config: {
					defaultStyle: 'unordered'
				},
				toolbox: [
					{
						title: 'unordered',
						icon: 'ul',
						data: {
							style: 'unordered'
						}
					},
					{
						title: 'ordered',
						icon: 'ol',
						data: {
							style: 'ordered'
						}
					}
				]
			},
			image: {
				class: ImageTool,
				config: {
					endpoints: {
						byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
						byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
					}
				},
				toolbox: {
					icon: 'img',
					title: 'Image'
				}
			},

				paragraph: {
		class: Paragraph,
			inlineToolbar: true,

					toolbox: {
			icon: 'txt',
				title: 'Paragraph'
					}

	},
},
		data: {
			time: 1552744582955,
			blocks: [
				{
					type: "header",
					data: {
						text: "Editor.js",
						level: 1
					}
				},
				{
					type: "paragraph",
					data: {
						text:
							"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text."
					}
				},
			],
			version: "2.12.4"
		}
	});

}

export default function Retour() {
	const { prosit, setProsit } = useContext(PrositContext);


	const ref = useRef(null)

	useEffect(() => {
		initEditor()

		console.log("editorjs")
	}, [])

	return (<> <div className="w-full" id="editorjs" /> </>)

		}
