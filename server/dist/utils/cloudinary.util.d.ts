import { v2 as cloudinary } from 'cloudinary';
export declare function initCloudinary(): void;
export declare function uploadToCloudinary(filePath: string, folder?: string): Promise<{
    url: string;
    publicId: string;
}>;
export declare function uploadBufferToCloudinary(buffer: Buffer, options?: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'auto';
    mimeType?: string;
}): Promise<{
    url: string;
    publicId: string;
    width?: number;
    height?: number;
}>;
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
export { cloudinary };
//# sourceMappingURL=cloudinary.util.d.ts.map