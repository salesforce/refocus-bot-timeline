/* eslint-disable no-invalid-this */
import postAttachment from '../services/postAttachment';

const MAX_FILE_SIZE = 5000000;

/**
 * @param {object} e - event object from file dropped on component
 * @param {object} bdk
 * @param {string} botName
 */
export function doUpload(e, bdk, botName) {
  this.setState({ fileDraggedOver: false });
  const data = e.dataTransfer ? e.dataTransfer : e.target;
  const { files } = data;
  if (files[0].size < MAX_FILE_SIZE) {
    files[0].status = 'Uploading';
    this.setState({ files });
    postAttachment(files[0], bdk, botName, this.props.selectedChatter);
  } else {
    files[0].status = 'FILE TOO LARGE';
    this.setState({ files });
  }
  e.stopPropagation();
  e.preventDefault();
}

/**
 * @param {object} e - event object on file dragged over component
 */
export function fileIsDraggedOver(e) {
  const { fileDraggedOver } = this.state;
  if (!fileDraggedOver) {
    this.setState({
      fileDraggedOver: true,
    });
  }
  e.stopPropagation();
  e.preventDefault();
}

/**
 * @param {object} e - event object generated on file dragged away from zone
 */
export function fileDraggedAway(e) {
  this.setState({
    fileDraggedOver: false,
  });
  e.preventDefault();
}
