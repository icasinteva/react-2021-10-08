import { replace, push } from 'connected-react-router';
import {
  DECREMENT,
  INCREMENT,
  REMOVE,
  ADD_REVIEW,
  LOAD_RESTAURANTS,
  CHANGE_RESTAURANT,
  LOAD_PRODUCTS,
  LOAD_REVIEWS,
  LOAD_USERS,
  REQUEST,
  SUCCESS,
  FAILURE,
  CREATE_ORDER,
} from './constants';

import {
  usersLoadingSelector,
  usersLoadedSelector,
  reviewsLoadingSelector,
  reviewsLoadedSelector,
  orderDataSelector,
} from './selectors';

export const increment = (id) => ({ type: INCREMENT, id });
export const decrement = (id) => ({ type: DECREMENT, id });
export const remove = (id) => ({ type: REMOVE, id });

export const changeRestaurant = (activeId) => ({
  type: CHANGE_RESTAURANT,
  activeId,
});

export const addReview = (review, restId) => ({
  type: ADD_REVIEW,
  review,
  restId,
  generateId: ['reviewId', 'userId'],
});

const apiUrl =
  'https://raw.githubusercontent.com/icasinteva/react-2021-10-08/refs/heads/master/src';

export const loadRestaurants = () => ({
  type: LOAD_RESTAURANTS,
  CallAPI: `${apiUrl}/restaurants.json`,
});
export const loadProducts = (restId) => ({
  type: LOAD_PRODUCTS,
  CallAPI: `${apiUrl}/products.json?id=${restId}`,
  restId,
});

const _loadUsers = () => ({
  type: LOAD_USERS,
  CallAPI: `${apiUrl}/users.json`,
});

export const loadReviews = (restId) => async (dispatch, getState) => {
  const state = getState();
  const loading = reviewsLoadingSelector(state, { restId });
  const loaded = reviewsLoadedSelector(state, { restId });

  if (loading || loaded) return;
  dispatch({ type: LOAD_REVIEWS + REQUEST, restId });

  try {
    const data = await fetch(`${apiUrl}/reviews.json?id=${restId}`).then(
      (res) => res.json()
    );
    dispatch({ type: LOAD_REVIEWS + SUCCESS, restId, data });
  } catch (error) {
    dispatch({ type: LOAD_REVIEWS + FAILURE, restId, error });
    dispatch(replace('/error'));
  }
};

export const loadUsers = () => async (dispatch, getState) => {
  const state = getState();
  const loading = usersLoadingSelector(state);
  const loaded = usersLoadedSelector(state);

  if (loading || loaded) return;

  dispatch(_loadUsers());
};

export const createOrder = () => async (dispatch, getState) => {
  const state = getState();
  const postData = orderDataSelector(state);

  try {
    await dispatch({
      type: CREATE_ORDER,
      CallAPI: '/api/order',
      postData,
    });
    dispatch(push('/order-success'));
  } catch {
    dispatch(push('/order-error'));
  }
};
