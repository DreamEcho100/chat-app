import MessageContainer from "./_components/messages/message-container";
import Sidebar from "./_components/sidebar/sidebar";

export default function HomePage() {
	return (
		<div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
			<Sidebar />
			<MessageContainer />
		</div>
	);
}
