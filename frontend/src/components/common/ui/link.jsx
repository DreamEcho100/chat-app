import { Link as RRDLink } from "react-router-dom";

/**
 * @param {Omit<import("react-router-dom").LinkProps, 'to'> & { href: import("react-router-dom").LinkProps['to'] }} props
 */
export default function Link({ href, ...props }) {
	return <RRDLink {...props} to={href} />;
}
