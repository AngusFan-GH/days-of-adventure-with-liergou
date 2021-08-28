<template>
  <view class="link-icon"></view>
</template>

<script>
export default {
  name: 'link-icon',
};
</script>

<style lang="scss" scoped>

.link-icon {
    position: relative;

    height: 16rpx;
    &:before,
    &:after {
        position: absolute;
        bottom: 6rpx;

        display: block;

        width: 14rpx;
        height: 60rpx;

        content: '';
        transform: translateY(50%);

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAA8CAYAAABW+ot3AAACbElEQVRIid2XP2gVQRDGf3cvxn+NJpWoKKKFnU9Qg4VoVARLwcruLfZaiq3a2tltLRZavC42SSMqwiNFCNgogqCVJujT/JGczGMGlvNu3+0JFg4c7O3Nt/PtzOzyXdbr9QgsAyaB3cB2YBMYAmtAETpOBONtwBHgEnAO2AesAq+AOWAZ+FEGCug0cBc4D+wIFrwKXAMeAM+BbzKZFUWBc+4Y8BC4qBSFcmhCcxG4Dbz03m/kzjlxnAVmakDo3AngCrBHJnJgF3BG6VWBQvApYK9zLst1f1NAJwIym7IAAvwFfAW2GgDFb92oSopfa63G2RvgiyQr1xXmtV7rEeCi1nPVe190BoMB/X5favMOOAQcLDWGge4BL7z3oyYY1VHMOTepnSMplz48DnwCngBPgSXv/dBWym0gRQXeyhB4BqwAC8Aj3dswpJCHL8Id+KlOW5q4taqM5+WJpt/rPsQ6KAoUapk2d1HlUAcUZ9tXZfQY1TyImgQs2lI1iklUDVxrMWC0JHXAcD6JqpTC9ll5wGNZtcxW+oxLTnIdoxkdF5FSPRsBW5+OEJiUVTtWWWpWLWJyk9eWIYVqclZbn46oNWmApIhh7ZKz2opqeN8k3zmtIv41sNW9SixJTW65JAerY20DTDjnwvdMZZnITll0pz6j3g19O91u18aisI4C14EbwAFgWhda0WezDDTZeR+4CexXySKC76xquM/AR2Aj3ONh4A5woUIMik9XtexJVdCjyX8nO009/s+y04DSVu/190BEXxXYZOfAvpsulaIKjVvA5dIPi2xDIi2FCjIUtCY7PwCPg1+k738oSOA3mCSyMcoPTx8AAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    &:before {
        left: 92rpx;
    }
    &:after {
        right: 92rpx;
    }
}

</style>