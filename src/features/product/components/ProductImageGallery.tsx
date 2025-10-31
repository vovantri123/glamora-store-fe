'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const THUMBNAILS_PER_PAGE = 4;

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const nextImage = () => {
    if (images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const nextThumbnails = () => {
    if (thumbnailStartIndex + THUMBNAILS_PER_PAGE < images.length) {
      setThumbnailStartIndex((prev) => prev + THUMBNAILS_PER_PAGE);
    }
  };

  const prevThumbnails = () => {
    if (thumbnailStartIndex > 0) {
      setThumbnailStartIndex((prev) => Math.max(0, prev - THUMBNAILS_PER_PAGE));
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src="/placeholder.png"
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md">
        <Image
          src={images[selectedImage].imageUrl}
          alt={images[selectedImage].altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {images
              .slice(
                thumbnailStartIndex,
                thumbnailStartIndex + THUMBNAILS_PER_PAGE
              )
              .map((img, idx) => {
                const actualIndex = thumbnailStartIndex + idx;
                return (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(actualIndex)}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 transition-all ${
                      selectedImage === actualIndex
                        ? 'border-orange-500 shadow-md ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || `${productName} ${actualIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </button>
                );
              })}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > THUMBNAILS_PER_PAGE && (
            <div className="flex items-center justify-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={prevThumbnails}
                disabled={thumbnailStartIndex === 0}
                className="h-8 w-8 rounded-full p-0 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-600">
                {Math.floor(thumbnailStartIndex / THUMBNAILS_PER_PAGE) + 1} /{' '}
                {Math.ceil(images.length / THUMBNAILS_PER_PAGE)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={nextThumbnails}
                disabled={
                  thumbnailStartIndex + THUMBNAILS_PER_PAGE >= images.length
                }
                className="h-8 w-8 rounded-full p-0 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
