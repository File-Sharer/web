import './Loader.styles.css';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loader() {
  return (
    <div className='loader__loader'>
      <ProgressSpinner style={{width: '300px', height: '300px'}} animationDuration='.8s' />
    </div>
  )
}
