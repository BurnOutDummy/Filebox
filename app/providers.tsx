import { ImageKitProvider } from "@imagekit/next";
export default function ProsProvider({
    childern,
}: {
    childern: React.ReactNode;
}) {
    return (
        <div>
            <ImageKitProvider urlEndpoint="">{childern}</ImageKitProvider>
        </div>
    );
}
