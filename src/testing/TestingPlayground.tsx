import { Block, Screen } from "../components";
import { useAnimateParallel } from "../hooks";

const _TestingPlayground: React.FC = () => {
	const transition = useAnimateParallel({ scale: [0, 1] });

	return (
		<Screen>
			<Block animations={transition.animations} />
		</Screen>
	);
};
