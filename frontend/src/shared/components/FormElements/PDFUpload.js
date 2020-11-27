import React, { useState, useEffect } from "react";

const PDFUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    console.log(event.target.files)
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
        type="file"
        accept="application/pdf"
        onChange={pickedHandler}
      />
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default PDFUpload;
