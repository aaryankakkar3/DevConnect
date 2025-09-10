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
    <label className="flex flex-col gap-2 w-full">
      {label}
      <input
        type={type}
        className="py-4 px-8 bg-bglight focus:outline-none focus:ring-0"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export default SingleInputField;
