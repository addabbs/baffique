const GAME_LEVELS = {
    "chapter_1": [
        {
            "id": "level_1",
            "name": "Корни Невежества",
            "width": 6000,
            "entities": [
                // Platforms
                { "type": "platform", "x": 0, "y": "ground", "width": 1200, "height": 500 },
                { "type": "platform", "x": 1320, "y": "ground", "width": 880, "height": 500 },
                { "type": "platform", "x": 2200, "y": "ground_minus_220", "width": 600, "height": 750 },
                { "type": "platform", "x": 3400, "y": "ground", "width": 200, "height": 500 },
                { "type": "platform", "x": 4500, "y": "ground_minus_180", "width": 1500, "height": 600 },

                // Hazards
                { "type": "hazard", "x": 3600, "y": "ground_plus_50", "width": 300, "height": 200 },
                { "type": "hazard", "x": 4300, "y": "ground_plus_100", "width": 300, "height": 200 },

                // Movables (Logic Stones)
                { "type": "movable", "x": 1900, "y": "ground_minus_100", "width": 100, "height": 100 },
                { "type": "movable", "x": 3300, "y": "ground_minus_100", "width": 100, "height": 100 },

                // Moving Platforms
                { "type": "moving_platform", "x": 4000, "y": "ground_minus_150", "width": 200, "height": 20, "rangeX": 200, "speed": 0.02 },

                // Scrolls
                { "type": "scroll", "x": 800, "y": "ground_minus_50", "text": "Око за око, и мир станет слепым. (Махатма Ганди)" },
                { "type": "scroll", "x": 2500, "y": "ground_minus_270", "text": "Никто из вас не уверует, пока не пожелает брату своему того же, чего желает себе. (Ислам, Хадис ан-Навави 13)" },
                { "type": "scroll", "x": 4000, "y": "ground_minus_50", "text": "Не делай другим того, что было бы больно тебе. (Буддизм, Удана-варга 5:18)" },
                { "type": "scroll", "x": 5600, "y": "ground_minus_230", "text": "Познание — это единственный свет, способный рассеять мрак невежества. (Заратуштра)" },

                // Gates
                { "type": "gate", "x": 5800, "y": "ground_minus_380", "nextLevel": "level_2" }
            ]
        },
        {
            "id": "level_2",
            "name": "Песочница Испытаний",
            "width": 6000,
            "entities": [
                // Начальная платформа
                { "type": "platform", "x": 0, "y": "ground", "width": 400, "height": 500 },
                
                // ТЕСТОВЫЕ СВИТКИ ДЛЯ УЛЬТЫ
                { "type": "scroll", "x": 100, "y": "ground_minus_50", "text": "Тестовый свиток 1" },
                { "type": "scroll", "x": 200, "y": "ground_minus_50", "text": "Тестовый свиток 2" },
                { "type": "scroll", "x": 300, "y": "ground_minus_50", "text": "Тестовый свиток 3" },
                
                // Озеро (Вода)
                { "type": "water", "x": 400, "y": "ground", "width": 500, "height": 300 },
                { "type": "scroll", "x": 600, "y": "ground_plus_150", "text": "Даже в самой глубокой воде можно найти истину, если уметь плавать. (Тайный свиток)", "isSecret": true },
                { "type": "platform", "x": 900, "y": "ground", "width": 300, "height": 500 },

                // Цепкий холм (Карабканье) - СДЕЛАН ШИРЕ ДЛЯ СТАБИЛЬНОСТИ
                { "type": "climbable", "x": 1200, "y": "ground_minus_300", "width": 80, "height": 300 },
                { "type": "platform", "x": 1200, "y": "ground_minus_300", "width": 350, "height": 20 },
                
                // Парящие платформы (СБЛИЖЕНЫ МАКСИМАЛЬНО)
                { "type": "hazard", "x": 1550, "y": "ground_plus_50", "width": 800, "height": 300 },
                { "type": "platform", "x": 1650, "y": "ground_minus_150", "width": 150, "height": 20 },
                { "type": "platform", "x": 1950, "y": "ground_minus_250", "width": 150, "height": 20 },
                
                // Зона с Камнями Логики (ОСТАВЛЕН ТОЛЬКО ОДИН КАМЕНЬ)
                { "type": "platform", "x": 2250, "y": "ground", "width": 1000, "height": 500 },
                { "type": "movable", "x": 2400, "y": "ground_minus_100", "width": 100, "height": 100 },
                
                // Зона Ветра (ПОЛЕТ) - Индекс 9
                { "type": "wind_zone", "x": 2800, "y": "ground_minus_600", "width": 400, "height": 700, "force": -1.3 },
                { "type": "scroll", "x": 3000, "y": "ground_minus_500", "text": "Тот, кто оседлал ветер, познает истинную свободу духа. (Суфизм)" },
                
                // Финальная часть
                { "type": "moving_platform", "x": 3350, "y": "ground_minus_200", "width": 200, "height": 20, "rangeX": 250, "speed": 0.02 },
                { "type": "platform", "x": 4000, "y": "ground", "width": 1200, "height": 500 },
                
                { "type": "gate", "x": 4800, "y": "ground_minus_380", "nextLevel": "end" }
            ]
        }
    ]
};
