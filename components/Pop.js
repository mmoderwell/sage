import Row from '../components/framework/Row'
import Column from '../components/framework/Column'

const styles = {
	pop: {
	    boxShadow: '9px 7px 40px -6px rgba(0, 0, 0, 0.25)',
	    padding: '4em',
	    borderRadius: '4px',
	    marginTop: '25%',
	    background: '#cee7ff',
	    marginRight: 'auto',
		marginLeft: 'auto',
	}
}

const Pop = (props) => (
    <div style={{...styles.pop, ...{width: `${props.maxwidth}%`}}}>
    {props.children}
	</div>
)

export default Pop