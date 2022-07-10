import React, { useCallback, useRef, useState } from "react";
import { View, FlatList, Image, Animated, Dimensions } from "react-native";
import { PropTypes } from ".";

import { Report } from "../../@types/application";
import { TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";

const dimensions = Dimensions.get("screen")
const TOLERANCE = 15 // Tolerância que damos para que as imagens fiquem por trás das bordas arredondadas 

export const IMAGE_HEIGHT = dimensions.height - TAB_BAR_HEIGHT_LONG + TOLERANCE

export let scrollToFunctions = Array<any>();

export default function ReportItem({ item, index }: { item: Report, index: number }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const slidesRef = useRef(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        return setCurrentIndex(viewableItems[0].index)
    }, []);
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const scrollTo = (factor: number) => {
        if (slidesRef.current !== null) {
            if (factor === 1 && currentIndex < item.images_urls.length - 1) {
                slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
            } else if (factor === -1 && currentIndex > 0) {
                slidesRef.current.scrollToIndex({ index: currentIndex - 1 })
            }
        }
    };

    let scrollFunctionsArrayCopy = scrollToFunctions;
    scrollFunctionsArrayCopy[index] = scrollTo;
    scrollToFunctions = scrollFunctionsArrayCopy;

    return (
        item.images_urls.length > 1 ?
            <View style={{ height: IMAGE_HEIGHT }}>
                {/* backgroundColor: index % 2 == 0 ? "blue" : "green", */}
                <FlatList
                    style={{ flex: item.images_urls.length > 1 ? item.images_urls.length : 1, backgroundColor: "black" }}
                    data={item.images_urls}
                    renderItem={({ item }) => <Image
                        style={{
                            flex: 1,
                            height: IMAGE_HEIGHT,
                            width: dimensions.width,
                            resizeMode: "cover"
                        }}
                        source={{ uri: item }}
                    />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={item => item}
                    scrollEventThrottle={32}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={viewabilityConfig}
                    ref={slidesRef}
                />
            </View>
            :
            <View style={{ height: IMAGE_HEIGHT }}>
                <Image
                    progressiveRenderingEnabled
                    style={{
                        flex: 1,
                        resizeMode: "cover"
                    }}
                    source={{ uri: item.images_urls[0] }}
                />
            </View>
    )
}