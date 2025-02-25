import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner/banner';
import NavBar from '../components/nav/navbar';

import SectionCards from '../components/card/section-cards';

import {
	getVideos,
	getPopularVideos,
	getWatchItAgainVideos,
} from '../lib/videos';
import { redirectUser } from '../utils/redirectUser';

export async function getServerSideProps(context) {
	const { userId, token } = await redirectUser(context);

	if (!userId) {
		return {
			props: {},
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}
	const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

	const disneyVideos = await getVideos('disney trailer');
	const productivityVideos = await getVideos('Productivity');

	const chessVideos = await getVideos('chess');

	const popularVideos = await getPopularVideos();
	return {
		props: {
			disneyVideos,
			chessVideos,
			productivityVideos,
			popularVideos,
			watchItAgainVideos,
		},
	};
}

export default function Home({
	disneyVideos,
	chessVideos,
	productivityVideos,
	popularVideos,
	watchItAgainVideos,
}) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Netflix</title>
				<link rel='icon' href='/Logo.svg' />
			</Head>

			<div className={styles.main}>
				<NavBar />
				<Banner
					videoId='4zH5iYM4wJo'
					title='Clifford the red dog'
					subTitle='a very cute dog'
					imgUrl='/static/clifford.webp'
				/>

				<div className={styles.sectionWrapper}>
					<SectionCards title='Disney' videos={disneyVideos} size='large' />
					{watchItAgainVideos.length !== 0 && (
						<SectionCards
							title='Watch it again'
							videos={watchItAgainVideos}
							size='small'
						/>
					)}
					<SectionCards title='Popular' videos={popularVideos} size='small' />
					<SectionCards
						title='Productivity'
						videos={productivityVideos}
						size='medium'
					/>
					<SectionCards title='Chess' videos={chessVideos} size='small' />
				</div>
			</div>
		</div>
	);
}
