const SingleInputField = ({
  label,
  value,
  type,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label}
      <input
        type={type}
        className="p-5 border border-text2 rounded-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
};

export default SingleInputField;
