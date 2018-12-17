const styles = {
	display: 'flex',
	flexDirection: 'column',
	//flex: '1 1 auto',
	padding: '0',
	width: '100%',
}
const Column = (props) => (

	<div style={{...styles, ...{flex: `0 0 ${props.size}%`}}}>
        {props.children}
    </div>
)

export default Column