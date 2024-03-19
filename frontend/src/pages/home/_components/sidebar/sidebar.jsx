import Conversations from "./conversations";
import LogoutButton from "./logout-button";
import SearchInput from "./search-input";

const Sidebar = () => {
	return (
		<div className="border-r border-slate-500 p-4 flex flex-col">
			<SearchInput />
			<div className="divider px-3"></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
