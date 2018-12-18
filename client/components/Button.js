import Row from '../components/framework/Row'
import Column from '../components/framework/Column'

const styles = {
	button: {
	    outline: 'none',
	    height: '40px',
	    textAlign: 'center',
	    width: '130px',
	    borderRadius: '40px',
	    background: '#cee7ff',
	    border: '2px solid #566b95',
	    color: '#566b95',
	    letterSpacing: '1px',
	    fontFamily: 'Hack',
	    fontSize: '12px',
	    fontWeight: 'bold',
	    cursor: 'pointer',
	    transition: 'all 0.25s ease',
	}
}

const Button = (props) => (
    <button style={styles.button}>
    {props.children}
	</button>
)

export default Button