import { GET_POST, POST_ERROR, DELETE_POST } from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

function postReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POST:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case DELETE_POST:
      return {
        loading: false,
        posts: state.posts.filter((post) => post._id !== payload),
      };

    default:
      return state;
  }
}

export default postReducer;
