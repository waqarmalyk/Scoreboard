interface ExtrasDisplayProps {
  wides: number;
  noBalls: number;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
}

export const ExtrasDisplay: React.FC<ExtrasDisplayProps> = ({
  wides,
  noBalls,
  getGlassColor,
  getBorderColor,
  getTextColor,
}) => {
  return (
    <div className='flex gap-4 mb-6'>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-lg border ${getBorderColor()} px-4 py-2 ${getTextColor()} flex-1 text-center`}
      >
        Wides: {wides}
      </div>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-lg border ${getBorderColor()} px-4 py-2 ${getTextColor()} flex-1 text-center`}
      >
        No Balls: {noBalls}
      </div>
    </div>
  );
};
