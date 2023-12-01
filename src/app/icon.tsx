import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(
		// ImageResponse JSX element
		<div
			style={{
				fontSize: 24,
				background: "transparent",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2rem"
				height="2rem"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#479efa"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>favicon</title>
				<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
				<path d="M5 3v4" />
				<path d="M19 17v4" />
				<path d="M3 5h4" />
				<path d="M17 19h4" />
			</svg>
		</div>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported icons size metadata
			// config to also set the ImageResponse's width and height.
			...size,
		},
	);
}
