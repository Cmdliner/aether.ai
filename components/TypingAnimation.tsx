import { TypeAnimation } from "react-type-animation";

export default function TypingAnimation() {
    return (
        <TypeAnimation
            sequence={[
                'Welcome to Æther.ai',
                3000,
                'Innovation + HealthCare',
                3000,
                'Join us in revolutionizing healthcare',
                2000,
                'Empowering Lives, One Step at a Time',
                1000,
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            className="text-3xl"
            style={{
                fontWeight: "bold",
                margin: "auto",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        />
    );
}