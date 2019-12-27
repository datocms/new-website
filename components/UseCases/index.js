import s from './style.css';
import Wrapper from '../Wrapper';
import Highlight from '../Highlight';

export default function UseCases() {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.firstRow}>
          <div className={s.title}>Read their stories</div>
          <div className={s.mainStory}>
            <div className={s.mainStoryTitle}>
              Arduino <Highlight>doubled his time-to-market speed</Highlight> with DatoCMS
            </div>
          </div>
        </div>
        <div className={s.otherUseCases}>
          <div className={s.otherUseCase}>
            <div className={s.otherUseCaseTitle}>
              Arduino <Highlight>doubled his time-to-market speed</Highlight> with DatoCMS
            </div>
          </div>
          <div className={s.otherUseCase}>
            <div className={s.otherUseCaseTitle}>
              Arduino <Highlight>doubled his time-to-market speed</Highlight> with DatoCMS
            </div>
          </div>
          <div className={s.otherUseCase}>
            <div className={s.otherUseCaseTitle}>
              Arduino <Highlight>doubled his time-to-market speed</Highlight> with DatoCMS
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}