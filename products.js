// Product catalog data
const products = {
    phones: [
        {
            id: 'phone-1',
            name: 'AI Phone Pro',
            description: 'Смартфон с AI-процессором',
            price: 89990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png'
        },
        {
            id: 'phone-2',
            name: 'Smart Phone X',
            description: 'Флагманский смартфон',
            price: 59990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png'
        }
    ],
    glasses: [
        {
            id: 'glasses-1',
            name: 'AI Glasses Vision',
            description: 'Умные AR очки',
            price: 45990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/smart_glasses_product_1768405799963.png'
        },
        {
            id: 'glasses-2',
            name: 'Smart Glasses Pro',
            description: 'Очки с AI-ассистентом',
            price: 34990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/smart_glasses_product_1768405799963.png'
        }
    ],
    devices: [
        {
            id: 'device-1',
            name: 'AI Assistant Hub',
            description: 'Умный дом-центр',
            price: 29990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png'
        },
        {
            id: 'device-2',
            name: 'Neural Processor',
            description: 'AI-устройство для дома',
            price: 79990,
            image: '/Users/ilkintagiev/.gemini/antigravity/brain/5268b78c-a9c2-471f-a362-51022149b1fd/ai_phone_product_1768405782907.png'
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
}
