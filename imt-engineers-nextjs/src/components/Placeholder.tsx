/**
 * Stand-in for product photography. Replace with next/image once real assets land:
 *   <Image src={product.image} alt={product.name} fill className="object-cover" />
 */
export default function Placeholder({ label = "Image" }: { label?: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center text-[11px] font-medium text-ui-faint"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg,#F0F3F6 0 10px,#E8ECF1 10px 20px)",
      }}
    >
      {label}
    </div>
  );
}
