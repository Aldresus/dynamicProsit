import { ImageResponse } from "next/og";

// Route segment config

// Image metadata
export const alt = "Hugo Champy";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
	// Font

	return new ImageResponse(
		// ImageResponse JSX element
		<div
			style={{
				fontSize: "4.75rem",
				background: "#ffffff",
				color: "#020817",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<span
				style={{
					padding: "1rem",
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3rem"
					height="3rem"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#479efa"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{
						marginBottom: "2rem",
					}}
				>
					<title style={
                        {
                            display: "none"
                        }
                    }>DynamicPrositX</title>

					<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
					<path d="M5 3v4" />
					<path d="M19 17v4" />
					<path d="M3 5h4" />
					<path d="M17 19h4" />
				</svg>
			</span>
		</div>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported opengraph-image
			// size config to also set the ImageResponse's width and height.
			...size,
		},
	);
}
