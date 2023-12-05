import React, {useEffect, useRef} from "react";
import EditorJS from "@editorjs/editorjs";
import {EDITOR_TOOLS} from "./editorTools";

// @ts-ignore
export default function Editor({ data, onChange, holder }) {
    //add a reference to editor
    const ref = useRef();

    //initialize editorjs
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(() => {
        //initialize editor if we don't have a reference
        if (!ref.current) {
            // @ts-ignore
            ref.current = new EditorJS({
                holder: holder,
                tools: EDITOR_TOOLS,
                data,
                async onChange(api, event) {
                    const data = await api.saver.save();
                    onChange(data);
                },
            });
        }

        //add a return function handle cleanup
        return () => {
            // @ts-ignore
            if (ref.current?.destroy) {
                // @ts-ignore
                ref.current.destroy();
            }
        };
    }, []);


    return <div id={holder} className="max-w-full bg-red-50" />;
};