import Image from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header"

export const EDITOR_TOOLS = {
    header: {
        class: Header,
        config: {
            placeholder: 'Enter a Header',
            levels: [2, 3, 4],
            defaultLevel: 2
        }
    },
    paragraph: Paragraph,
    image: Image,
    list: List,
};