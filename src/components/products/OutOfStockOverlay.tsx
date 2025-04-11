type OutOfStockOverlayProps = {
  isOutOfStock: boolean;
};

const OutOfStockOverlay = ({ isOutOfStock }: OutOfStockOverlayProps) => {
  if (!isOutOfStock) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <span className="text-white font-bold text-lg">Out of Stock</span>
    </div>
  );
};

export default OutOfStockOverlay;
