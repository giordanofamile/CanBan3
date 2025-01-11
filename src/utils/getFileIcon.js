import pdfIcon from "../assets/icon-pdf.svg";
    import docIcon from "../assets/icon-doc.svg";
    import imageIcon from "../assets/icon-image.svg";
    import otherIcon from "../assets/icon-other.svg";

    export const getFileIcon = (fileType) => {
      if (fileType === "application/pdf") {
        return pdfIcon;
      } else if (
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        return docIcon;
      } else if (fileType.startsWith("image/")) {
        return imageIcon;
      } else {
        return otherIcon;
      }
    };
