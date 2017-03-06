

const initialState = {
  ProWebSocket: {},
  SpotWebSocket: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ProWebSocket':
      console.log(action.resp, 'ProWebSocket');
      return { ...state, ProWebSocket: action.resp };
    case 'SpotWebSocket':
      console.log(action.resp, 'SpotWebSocket');
      return {...state, SpotWebSocket: action.resp }
    default:
      return state;
  }
}