type FieldsetProps = {
  legend : string,
  infos: Record<string,string>[],
  fieldsetStyle: string,
  placeholders?: string [],
  labelStyle?: string,
  inputStyle?: string,
}

export default function Fieldset ({legend, infos, fieldsetStyle, placeholders=[], labelStyle, inputStyle} : FieldsetProps) { 
    
  return (
    <fieldset className={fieldsetStyle}>
      <legend>{legend}</legend>
      {infos.map ((info: Record<string, string>, i: number) => (
      <div key = {info.id} className ="field">
        <label htmlFor={info.id} className={labelStyle}>
          {info.label}
        </label>
        <input
          className={inputStyle}
          id = {info.id}
          name = {info.name}
          type = {info.type}
          title = {info.label}
          placeholder = {placeholders.length > 0 ? placeholders[i] : info.placeholder}
          {...(info.value ? { value : info.value } : {} )}
          {...(info.min ? { min : info.min } : {} )}

          required
        />
      </div>
      ))}
    </fieldset>
  )
}