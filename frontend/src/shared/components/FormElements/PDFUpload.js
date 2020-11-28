import React, { useRef, useState, useEffect } from "react";

const PDFUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();
  useEffect(() => {
        if (!file) {
          return;
        }
  }, [file]);

  const pickedHandler = (event) => {
    filePickerRef.current.click();
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        ref={filePickerRef}
        type="file"
        accept="application/pdf"
        onChange={pickedHandler}
      />
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default PDFUpload;
