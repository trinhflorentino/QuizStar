import { SelectedAnswersAction } from "../types";

export const selectedAnswersReducer = (state: any, action: SelectedAnswersAction): any => {
  switch (action.type) {
    case 'SET_MCQ_ANSWER':
      return {
        ...state,
        [action.questionIndex]: action.optionIndex
      };
    case 'SET_TF_ANSWER':
      return {
        ...state,
        [`tf_${action.questionIndex}_${action.optionIndex}`]: action.isTrue
      };
    case 'RESTORE_ANSWERS':
      return action.answers;
    case 'RESET':
      return {};
    default:
      return state;
  }
};


