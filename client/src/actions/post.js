import axios from "axios";
import { setAlert } from "./alert";

import { GET_POST, POST_ERROR, DELETE_POST } from "./types";

/**
 * 전체  포스트 조회하기
 *
 */
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

/**
 * 포스트 삭제
 *
 */
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert("포스트가 삭제되었습니다", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
