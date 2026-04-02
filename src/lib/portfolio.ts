export type PortfolioImage = {
  url: string;
  caption: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  images: PortfolioImage[];
};

export type MixedPortfolioImage = PortfolioImage & {
  projectSlug: string;
  projectTitle: string;
  imageIndex: number;
};

/** Optimised delivery for thumbnails and grids */
export function getImageUrl(url: string, width: number): string {
  return url.replace("/upload/", `/upload/w_${width},c_limit,f_auto,q_auto:best,fl_progressive/`);
}

/** Full-resolution delivery for single-image view */
export function getFullImageUrl(url: string): string {
  return url.replace("/upload/", `/upload/c_limit,f_auto,q_100/`);
}

function img(url: string): PortfolioImage {
  const filename = decodeURIComponent(url.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
  return { url, caption: filename };
}

export const projects: PortfolioProject[] = [
  {
    slug: "about-a-happy-childhood",
    title: "About a Happy Childhood",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125052/portfolio/About%20a%20Happy%20Childhood/DSC_0080.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122603/portfolio/About%20a%20Happy%20Childhood/DSC_0134.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122604/portfolio/About%20a%20Happy%20Childhood/DSC_0185.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122606/portfolio/About%20a%20Happy%20Childhood/DSC_0186.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122607/portfolio/About%20a%20Happy%20Childhood/DSC_0205.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122609/portfolio/About%20a%20Happy%20Childhood/DSC_0212.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125057/portfolio/About%20a%20Happy%20Childhood/DSC_0217.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122611/portfolio/About%20a%20Happy%20Childhood/DSC_0219.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125059/portfolio/About%20a%20Happy%20Childhood/DSC_0220.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122613/portfolio/About%20a%20Happy%20Childhood/DSC_0374.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122614/portfolio/About%20a%20Happy%20Childhood/DSC_0385.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122616/portfolio/About%20a%20Happy%20Childhood/DSC_0387.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122618/portfolio/About%20a%20Happy%20Childhood/DSC_0391.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122620/portfolio/About%20a%20Happy%20Childhood/DSC_0405.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122622/portfolio/About%20a%20Happy%20Childhood/DSC_0427.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122624/portfolio/About%20a%20Happy%20Childhood/DSC_0442.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122626/portfolio/About%20a%20Happy%20Childhood/DSC_0443.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125066/portfolio/About%20a%20Happy%20Childhood/DSC_0487.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122627/portfolio/About%20a%20Happy%20Childhood/DSC_0530.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122629/portfolio/About%20a%20Happy%20Childhood/DSC_0531.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122630/portfolio/About%20a%20Happy%20Childhood/DSC_0573.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122631/portfolio/About%20a%20Happy%20Childhood/DSC_0575.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122633/portfolio/About%20a%20Happy%20Childhood/DSC_0597-2.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122634/portfolio/About%20a%20Happy%20Childhood/DSC_0684.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122635/portfolio/About%20a%20Happy%20Childhood/DSC_0751.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122637/portfolio/About%20a%20Happy%20Childhood/DSC_0802.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122638/portfolio/About%20a%20Happy%20Childhood/DSC_0832.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122640/portfolio/About%20a%20Happy%20Childhood/DSC_0923-2.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125074/portfolio/About%20a%20Happy%20Childhood/DSC_0960.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122642/portfolio/About%20a%20Happy%20Childhood/DSC_0961.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122643/portfolio/About%20a%20Happy%20Childhood/DSC_0972.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122645/portfolio/About%20a%20Happy%20Childhood/DSC_1022.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122646/portfolio/About%20a%20Happy%20Childhood/DSC_1035.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122648/portfolio/About%20a%20Happy%20Childhood/DSC_1037.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122649/portfolio/About%20a%20Happy%20Childhood/DSC_1085.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122651/portfolio/About%20a%20Happy%20Childhood/DSC_1198.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122653/portfolio/About%20a%20Happy%20Childhood/DSC_9882.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122654/portfolio/About%20a%20Happy%20Childhood/DSC_9887.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122656/portfolio/About%20a%20Happy%20Childhood/DSC_9940.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122657/portfolio/About%20a%20Happy%20Childhood/DSC_9941.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125084/portfolio/About%20a%20Happy%20Childhood/DSC_9950.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122660/portfolio/About%20a%20Happy%20Childhood/DSC_9971.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122661/portfolio/About%20a%20Happy%20Childhood/DSC_9977.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122663/portfolio/About%20a%20Happy%20Childhood/DSC_9980.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122665/portfolio/About%20a%20Happy%20Childhood/DSC_9981.jpg",
    ].map(img),
  },
  {
    slug: "big-citys-love",
    title: "Big City's Love",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122666/portfolio/Big%20City%27s%20Love/DSC_7508.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122667/portfolio/Big%20City%27s%20Love/DSC_7509.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122669/portfolio/Big%20City%27s%20Love/DSC_7522.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122670/portfolio/Big%20City%27s%20Love/DSC_7523.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122671/portfolio/Big%20City%27s%20Love/DSC_7544.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122673/portfolio/Big%20City%27s%20Love/DSC_7547.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122674/portfolio/Big%20City%27s%20Love/DSC_7568.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122676/portfolio/Big%20City%27s%20Love/DSC_7569.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122678/portfolio/Big%20City%27s%20Love/DSC_7574.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122680/portfolio/Big%20City%27s%20Love/DSC_7579.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122682/portfolio/Big%20City%27s%20Love/DSC_7585.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122683/portfolio/Big%20City%27s%20Love/DSC_7589.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122685/portfolio/Big%20City%27s%20Love/DSC_7590.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122686/portfolio/Big%20City%27s%20Love/DSC_7600.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122688/portfolio/Big%20City%27s%20Love/DSC_7601.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122689/portfolio/Big%20City%27s%20Love/DSC_7609.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122692/portfolio/Big%20City%27s%20Love/DSC_7617.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122694/portfolio/Big%20City%27s%20Love/DSC_7620.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122696/portfolio/Big%20City%27s%20Love/DSC_7638.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122698/portfolio/Big%20City%27s%20Love/DSC_7664.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122699/portfolio/Big%20City%27s%20Love/DSC_7686.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122701/portfolio/Big%20City%27s%20Love/DSC_7690.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122702/portfolio/Big%20City%27s%20Love/DSC_7692.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122704/portfolio/Big%20City%27s%20Love/DSC_7695.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122706/portfolio/Big%20City%27s%20Love/DSC_7703.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122707/portfolio/Big%20City%27s%20Love/DSC_7708.jpg",
    ].map(img),
  },
  {
    slug: "love-in-every-moment",
    title: "Love in Every Moment",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122708/portfolio/Love%20in%20every%20moment/DSC_8200.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122710/portfolio/Love%20in%20every%20moment/DSC_8216.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122712/portfolio/Love%20in%20every%20moment/DSC_8217.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122713/portfolio/Love%20in%20every%20moment/DSC_8218.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122715/portfolio/Love%20in%20every%20moment/DSC_8238.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122716/portfolio/Love%20in%20every%20moment/DSC_8241.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122718/portfolio/Love%20in%20every%20moment/DSC_8242.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122719/portfolio/Love%20in%20every%20moment/DSC_8243.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122721/portfolio/Love%20in%20every%20moment/DSC_8244.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122722/portfolio/Love%20in%20every%20moment/DSC_8246.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122723/portfolio/Love%20in%20every%20moment/DSC_8249.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122725/portfolio/Love%20in%20every%20moment/DSC_8256.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122727/portfolio/Love%20in%20every%20moment/DSC_8261.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122728/portfolio/Love%20in%20every%20moment/DSC_8263.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122730/portfolio/Love%20in%20every%20moment/DSC_8272.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122732/portfolio/Love%20in%20every%20moment/DSC_8273.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122733/portfolio/Love%20in%20every%20moment/DSC_8278.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122735/portfolio/Love%20in%20every%20moment/DSC_8280.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122736/portfolio/Love%20in%20every%20moment/DSC_8282.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122738/portfolio/Love%20in%20every%20moment/DSC_8285.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122739/portfolio/Love%20in%20every%20moment/DSC_8506.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122741/portfolio/Love%20in%20every%20moment/DSC_8507.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122743/portfolio/Love%20in%20every%20moment/DSC_8550.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122744/portfolio/Love%20in%20every%20moment/DSC_8551.jpg",
    ].map(img),
  },
  {
    slug: "unforgettable-love",
    title: "Unforgettable Love",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122745/portfolio/Unforgettable%20Love/DSC_7154.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122746/portfolio/Unforgettable%20Love/DSC_7164.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122747/portfolio/Unforgettable%20Love/DSC_7180.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122748/portfolio/Unforgettable%20Love/DSC_7182.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122749/portfolio/Unforgettable%20Love/DSC_7218.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122750/portfolio/Unforgettable%20Love/DSC_7267.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122751/portfolio/Unforgettable%20Love/DSC_7274.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122752/portfolio/Unforgettable%20Love/DSC_7277.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122753/portfolio/Unforgettable%20Love/DSC_7299.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122754/portfolio/Unforgettable%20Love/DSC_7306.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122754/portfolio/Unforgettable%20Love/DSC_7374.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122755/portfolio/Unforgettable%20Love/DSC_7375.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122756/portfolio/Unforgettable%20Love/DSC_7404.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122757/portfolio/Unforgettable%20Love/DSC_7407.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122757/portfolio/Unforgettable%20Love/DSC_7408.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122758/portfolio/Unforgettable%20Love/DSC_7417.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122759/portfolio/Unforgettable%20Love/DSC_7423.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122760/portfolio/Unforgettable%20Love/DSC_7445.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122760/portfolio/Unforgettable%20Love/DSC_7455.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122761/portfolio/Unforgettable%20Love/DSC_7470.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122762/portfolio/Unforgettable%20Love/DSC_7472.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122763/portfolio/Unforgettable%20Love/DSC_7477.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122764/portfolio/Unforgettable%20Love/DSC_7478.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122764/portfolio/Unforgettable%20Love/DSC_7495.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122765/portfolio/Unforgettable%20Love/DSC_7544.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122766/portfolio/Unforgettable%20Love/DSC_7551.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122767/portfolio/Unforgettable%20Love/DSC_7553.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122767/portfolio/Unforgettable%20Love/DSC_7557.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122768/portfolio/Unforgettable%20Love/DSC_7579.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122769/portfolio/Unforgettable%20Love/DSC_7586.jpg",
    ].map(img),
  },
  {
    slug: "waiting-for-happiness",
    title: "Waiting for Happiness",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122770/portfolio/Waiting%20for%20happiness/DSC_3829.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122772/portfolio/Waiting%20for%20happiness/DSC_3841.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122773/portfolio/Waiting%20for%20happiness/DSC_3890.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122775/portfolio/Waiting%20for%20happiness/DSC_3927.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122777/portfolio/Waiting%20for%20happiness/DSC_3932.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122778/portfolio/Waiting%20for%20happiness/DSC_3960.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122779/portfolio/Waiting%20for%20happiness/DSC_4020.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122780/portfolio/Waiting%20for%20happiness/DSC_4025.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122781/portfolio/Waiting%20for%20happiness/DSC_4073.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122782/portfolio/Waiting%20for%20happiness/DSC_4187.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122784/portfolio/Waiting%20for%20happiness/DSC_4268.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122785/portfolio/Waiting%20for%20happiness/DSC_4341.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122786/portfolio/Waiting%20for%20happiness/DSC_4343.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122787/portfolio/Waiting%20for%20happiness/DSC_4354.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122788/portfolio/Waiting%20for%20happiness/DSC_4380.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122789/portfolio/Waiting%20for%20happiness/DSC_4384.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122791/portfolio/Waiting%20for%20happiness/DSC_4391.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122792/portfolio/Waiting%20for%20happiness/DSC_4396.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122793/portfolio/Waiting%20for%20happiness/DSC_4409.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122794/portfolio/Waiting%20for%20happiness/DSC_4410.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122795/portfolio/Waiting%20for%20happiness/DSC_4412.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122796/portfolio/Waiting%20for%20happiness/DSC_4448.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122798/portfolio/Waiting%20for%20happiness/DSC_4470.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122799/portfolio/Waiting%20for%20happiness/DSC_4494.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122800/portfolio/Waiting%20for%20happiness/DSC_4498.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122801/portfolio/Waiting%20for%20happiness/DSC_4499.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122802/portfolio/Waiting%20for%20happiness/DSC_4502.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122804/portfolio/Waiting%20for%20happiness/DSC_4515.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122805/portfolio/Waiting%20for%20happiness/DSC_4623-2.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122806/portfolio/Waiting%20for%20happiness/DSC_4660.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122807/portfolio/Waiting%20for%20happiness/DSC_4693.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122808/portfolio/Waiting%20for%20happiness/DSC_4694.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122809/portfolio/Waiting%20for%20happiness/DSC_4737.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122810/portfolio/Waiting%20for%20happiness/DSC_4751.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122811/portfolio/Waiting%20for%20happiness/DSC_4754.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122812/portfolio/Waiting%20for%20happiness/DSC_4764.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122814/portfolio/Waiting%20for%20happiness/DSC_4770.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122815/portfolio/Waiting%20for%20happiness/DSC_4843.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122816/portfolio/Waiting%20for%20happiness/DSC_4852.jpg",
    ].map(img),
  },
  {
    slug: "wedding",
    title: "Wedding",
    images: [
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125161/portfolio/Wedding/DSC_0235.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122818/portfolio/Wedding/DSC_0259.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122820/portfolio/Wedding/DSC_0275.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122821/portfolio/Wedding/DSC_0294.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122823/portfolio/Wedding/DSC_0332.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122824/portfolio/Wedding/DSC_0365.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775125166/portfolio/Wedding/DSC_0381.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122827/portfolio/Wedding/DSC_0393.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122828/portfolio/Wedding/DSC_0411.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122829/portfolio/Wedding/DSC_0428.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122830/portfolio/Wedding/DSC_0507.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122832/portfolio/Wedding/DSC_0518.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122834/portfolio/Wedding/DSC_0630.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122835/portfolio/Wedding/DSC_0642.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122836/portfolio/Wedding/DSC_0702.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122838/portfolio/Wedding/DSC_0709.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122839/portfolio/Wedding/DSC_0722.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122840/portfolio/Wedding/DSC_0738.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122841/portfolio/Wedding/DSC_0787.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122843/portfolio/Wedding/DSC_0789.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122845/portfolio/Wedding/DSC_0841.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122846/portfolio/Wedding/DSC_0844.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122847/portfolio/Wedding/DSC_0875.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122849/portfolio/Wedding/DSC_0880.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122850/portfolio/Wedding/DSC_0895.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122851/portfolio/Wedding/DSC_0898.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122854/portfolio/Wedding/DSC_0909.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122855/portfolio/Wedding/DSC_0931.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122857/portfolio/Wedding/DSC_0957.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122858/portfolio/Wedding/DSC_0981.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122860/portfolio/Wedding/DSC_0993.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122861/portfolio/Wedding/DSC_1003.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122863/portfolio/Wedding/DSC_1016.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122864/portfolio/Wedding/DSC_1107.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122865/portfolio/Wedding/DSC_1118.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122867/portfolio/Wedding/DSC_1143.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122868/portfolio/Wedding/DSC_1247.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122869/portfolio/Wedding/DSC_1272.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122871/portfolio/Wedding/DSC_1273.jpg",
      "https://res.cloudinary.com/duodyvg1h/image/upload/v1775122872/portfolio/Wedding/DSC_1321.jpg",
    ].map(img),
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getMixedOverviewImages(): MixedPortfolioImage[] {
  const maxLength = Math.max(...projects.map((p) => p.images.length));
  const mixed: MixedPortfolioImage[] = [];

  for (let imageIndex = 0; imageIndex < maxLength; imageIndex++) {
    for (const project of projects) {
      const image = project.images[imageIndex];
      if (!image) continue;
      mixed.push({ ...image, projectSlug: project.slug, projectTitle: project.title, imageIndex });
    }
  }

  return mixed;
}
