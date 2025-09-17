const SingleInputField = ({
  label,
  value,
  type,
  onChange,
}: {
  label: string;
  value: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label}
      <input
        type={type}
        className="p-4 bg-bg2 focus:outline-none focus:ring-0"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export default SingleInputField;
