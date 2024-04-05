// "use client";
// import React, { useContext } from "react";
// import { BlockNoteView, useBlockNote } from "@blocknote/react";
// import "@blocknote/react/style.css";
// import "@/app/(seo)/retour/editor.css";

// import {
//   BlockNoteEditor,
//   PartialBlock,
//   uploadToTmpFilesDotOrg_DEV_ONLY,
// } from "@blocknote/core";
// import PrositContext from "@/components/prositContext";
// import { useMantineColorScheme } from "@mantine/core";
// import { OrderedItem } from "@/types/orderedItem";

// export default function Retour() {
//   const { prosit, setProsit } = useContext(PrositContext);
//   const { colorScheme } = useMantineColorScheme();
//   const editor: BlockNoteEditor = useBlockNote({
//     uploadFile: (file) => {
//       console.log("uploading file", file);
//       let fr = new FileReader();
//       fr.onload = function () {
//         console.log(fr.result);
//       };
//       console.log(fr.readAsDataURL(file));
//       return uploadToTmpFilesDotOrg_DEV_ONLY(file);
//     },
//     initialContent: [
//       {
//         type: "heading",
//         props: {
//           level: 1,
//         },
//         content: prosit.titre,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: `Animateur : ${prosit.animateur}`,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: `Scribe : ${prosit.scribe}`,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: `Gestionnaire : ${prosit.gestionnaire}`,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: `Secrétaire : ${prosit.secretaire}`,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Mots-clefs`,
//         children: prosit.motsCles.map((mot) => {
//           return {
//             type: "bulletListItem",
//             content: mot,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Contexte`,
//         children: [
//           {
//             type: "paragraph",
//             content: prosit.contexte,
//           },
//         ],
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Contraintes`,
//         children: prosit.contraintes.map((mot) => {
//           return {
//             type: "bulletListItem",
//             content: mot,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Problématiques`,
//         children: prosit.problematiques.map((mot) => {
//           return {
//             type: "bulletListItem",
//             content: mot,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Livrables`,
//         children: prosit.livrables.map((mot) => {
//           return {
//             type: "bulletListItem",
//             content: mot,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Généralisation`,
//         children: [
//           {
//             type: "paragraph",
//             content: prosit.generalisation,
//           },
//         ],
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         props: {
//           level: 2,
//         },
//         content: `Pistes de solutions`,
//         children: prosit.pistesDeSolutions.map((mot) => {
//           return {
//             type: "bulletListItem",
//             content: mot,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       {
//         type: "heading",
//         id: "planDAction",
//         props: {
//           level: 2,
//         },
//         content: `Plan d'action`,
//         children: prosit.planDAction.map((mot) => {
//           return {
//             type: "numberedListItem",
//             content: mot.content,
//           };
//         }),
//       },
//       {
//         type: "heading",
//         props: {
//           level: 3,
//         },
//         content: ` `,
//       },
//       ...prosit.planDAction.map((step) => {
//         return {
//           type: "heading",
//           props: {
//             level: 2,
//           },
//           content: `${step.order}. ${step.content}`,
//           children: [
//             {
//               type: "paragraph",
//             },
//           ],
//         };
//       }),
//     ],
//   });

//   // useEffect(() => {
//   //   if (prosit) {

//   //   }
//   // }, [prosit]);

//   // Executes a callback whenever the editor contents change.
//   editor.onEditorContentChange(() => {
//     // Get and log all top-level, i.e. non-nested blocks in the editor.
//     const blocks = editor.topLevelBlocks;
//     console.log("Content was changed:", blocks);
//   });

//   return (
//     <div className="h-full flex justify-center pt-20">
//       <BlockNoteView
//         className="w-[60%]"
//         editor={editor}
//         theme={colorScheme === "dark" ? "dark" : "light"}
//       />
//     </div>
//   );
// }

export default function Editor() {
	return <div>Editor</div>;
}
