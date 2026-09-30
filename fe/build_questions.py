# -*- coding: utf-8 -*-
"""
HCM202 Question Database Generator & Validator
Generates 140+ rigorous questions grounded in the official 2021 HCM202 Curriculum
"""
import json
import os

questions_dir = "fe/src/data/questions"
os.makedirs(questions_dir, exist_ok=True)

# 1. CULTURE (22 questions)
culture_questions = [
    {
        "id": "CULT_001",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Theo định nghĩa của Hồ Chí Minh vào tháng 8/1943, văn hóa được hiểu là gì?",
        "options": [
            "Chỉ là các tác phẩm văn học nghệ thuật đỉnh cao của dân tộc",
            "Toàn bộ những sáng tạo và phát minh vì lẽ sinh tồn cũng như mục đích của cuộc sống",
            "Các phong tục tập quán truyền thống được lưu truyền từ ngàn xưa",
            "Hệ thống các quy phạm pháp luật và thiết chế nhà nước"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Tháng 8/1943, trong Nhật ký trong tù, Hồ Chí Minh viết: 'Vì lẽ sinh tồn cũng như mục đích của cuộc sống, loài người mới sáng tạo và phát minh ra ngôn ngữ, chữ viết, đạo đức, pháp luật, khoa học, tôn giáo, văn học, nghệ thuật, những công cụ cho sinh hoạt hằng ngày về mặc, ăn, ở và các phương thức sử dụng. Toàn bộ những sáng tạo và phát minh đó tức là văn hóa.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 119"
    },
    {
        "id": "CULT_002",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Theo tư tưởng Hồ Chí Minh, trong mối quan hệ với sự phát triển xã hội, văn hóa giữ vai trò gì?",
        "options": [
            "Chỉ là kết quả thụ động sau khi kinh tế đã hoàn thiện",
            "Chỉ là phương tiện giải trí nhằm thư giãn tinh thần",
            "Vừa là mục tiêu, vừa là động lực của sự nghiệp cách mạng",
            "Một lĩnh vực độc lập không liên hệ gì với chính trị và kinh tế"
        ],
        "correctAnswer": 2,
        "points": 100,
        "explanation": "Hồ Chí Minh khẳng định văn hóa vừa là mục tiêu (xây dựng một xã hội văn minh, tự do, hạnh phúc), vừa là động lực (khơi dậy lòng yêu nước, ý chí tự lực tự cường và trí tuệ dân tộc).",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "CULT_003",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Luận điểm nổi tiếng nào của Hồ Chí Minh tại Hội nghị Văn hóa toàn quốc lần thứ nhất (1946) khẳng định tính định hướng của văn hóa?",
        "options": [
            "Văn hóa soi đường cho quốc dân đi",
            "Văn hóa phải đứng ngoài chính trị",
            "Kinh tế đi trước, văn hóa theo sau",
            "Văn hóa là sản phẩm thuần túy của nghệ thuật"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Tại Hội nghị Văn hóa toàn quốc lần thứ nhất (24/11/1946), Người khẳng định: 'Văn hóa soi đường cho quốc dân đi', chỉ rõ văn hóa có sứ mệnh định hướng nhận thức, tư tưởng và hành động của cả dân tộc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "CULT_004",
        "category": "CULTURE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Theo tư tưởng Hồ Chí Minh, văn hóa là một mặt trận, và người làm công tác văn hóa là chiến sĩ trên mặt trận ấy.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Trong Thư gửi các họa sĩ nhân dịp Triển lãm hội họa (1951), Người viết: 'Văn hóa nghệ thuật cũng là một mặt trận. Anh chị em là chiến sĩ trên mặt trận ấy.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 123"
    },
    {
        "id": "CULT_005",
        "category": "CULTURE",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Hồ Chí Minh, phải phát triển kinh tế xong hoàn toàn rồi mới tiến hành xây dựng và phát triển văn hóa.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Sai. Hồ Chí Minh nhấn mạnh văn hóa, chính trị, kinh tế, xã hội phải được coi trọng ngang nhau. Văn hóa không thể đứng ngoài mà phải ở trong kinh tế và chính trị, thúc đẩy kinh tế phát triển.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 120"
    },
    {
        "id": "CULT_006",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Trong thời kỳ kháng chiến chống thực dân Pháp, nền văn hóa mới được Hồ Chí Minh xác định gồm ba tính chất nào?",
        "options": [
            "Hiện đại, khoa học, quần chúng",
            "Dân tộc, khoa học, đại chúng",
            "Truyền thống, tiến bộ, nhân văn",
            "Dân tộc, giai cấp, tiên tiến"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Hồ Chí Minh cùng Đảng ta xác định nền văn hóa kháng chiến có tính chất: Dân tộc, Khoa học và Đại chúng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "CULT_007",
        "category": "CULTURE",
        "type": "GUESS_THE_IDEA",
        "difficulty": "HARD",
        "question": "Giải mã khái niệm văn hóa qua các manh mối sau:",
        "clues": [
            "Clue 1: Đây là chủ trương của Bác nhằm quét sạch những tàn tích hủ tục, thói hư tật xấu của chế độ cũ.",
            "Clue 2: Khái niệm này bao gồm ba nội dung cốt lõi: Đạo đức mới, Lối sống mới và Nếp sống mới.",
            "Clue 3: Tác phẩm của Bác ký bút danh Tân Sinh năm 1947 mang chính tên gọi của cuộc vận động này."
        ],
        "options": [
            "Phong trào Bình dân học vụ",
            "Xây dựng Đời sống mới",
            "Mặt trận Việt Minh",
            "Cải cách ruộng đất"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Đó chính là 'Đời sống mới'. Tháng 3/1947, Bác viết tác phẩm 'Đời sống mới' với nội dung xây dựng đạo đức mới, lối sống mới và nếp sống mới.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 126"
    },
    {
        "id": "CULT_008",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Chức năng nào sau đây KHÔNG PHẢI là chức năng chủ yếu của văn hóa theo tư tưởng Hồ Chí Minh?",
        "options": [
            "Bồi dưỡng tư tưởng đúng đắn và tình cảm cao đẹp",
            "Mở rộng hiểu biết, nâng cao dân trí",
            "Thương mại hóa mọi di sản để tối đa hóa lợi nhuận kinh tế",
            "Bồi dưỡng những phẩm chất, phong cách và lối sống lành mạnh"
        ],
        "correctAnswer": 2,
        "points": 200,
        "explanation": "Ba chức năng lớn của văn hóa theo Hồ Chí Minh là: 1) Bồi dưỡng tư tưởng đúng đắn, tình cảm cao đẹp; 2) Mở rộng hiểu biết, nâng cao dân trí; 3) Bồi dưỡng phẩm chất, lối sống tốt đẹp hướng con người đến Chân - Thiện - Mỹ. Thương mại hóa tiêu cực hoàn toàn xa lạ với văn hóa cách mạng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 123"
    },
    {
        "id": "CULT_009",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Quan điểm 'Văn hóa phải ở trong kinh tế và chính trị' của Hồ Chí Minh có hàm ý cốt lõi gì?",
        "options": [
            "Văn hóa phải phụ thuộc hoàn toàn vào các chỉ tiêu kinh tế",
            "Văn hóa phải tham gia vào việc thúc đẩy sản xuất, củng cố chính quyền và phát triển đời sống",
            "Cán bộ kinh tế có quyền chỉ đạo trực tiếp nội dung sáng tạo nghệ thuật",
            "Văn hóa chỉ có giá trị khi sinh ra lợi nhuận tài chính"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Văn hóa ở trong kinh tế và chính trị nghĩa là văn hóa phải soi đường, cổ vũ, thúc đẩy các nhiệm vụ kinh tế và chính trị, tạo động lực tinh thần và trí tuệ để thực hiện thắng lợi mục tiêu kháng chiến và kiến quốc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 121"
    },
    {
        "id": "CULT_010",
        "category": "CULTURE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Theo Hồ Chí Minh, tiếp thu tinh hoa văn hóa nhân loại là tiếp thu một cách có chọn lọc, kết hợp với phát huy bản sắc văn hóa dân tộc.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Người căn dặn phải giữ gìn cốt cách dân tộc, đồng thời mở rộng tầm nhìn học hỏi những điều hay, tiến bộ của văn hóa thế giới cả Đông lẫn Tây.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "CULT_011",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh xác định đối tượng phục vụ hàng đầu của văn hóa là ai?",
        "options": [
            "Tầng lớp trí thức và quý tộc",
            "Các nhà tài trợ nghệ thuật",
            "Quần chúng nhân dân lao động (Công - Nông - Binh)",
            "Chỉ riêng cán bộ làm công tác đối ngoại"
        ],
        "correctAnswer": 2,
        "points": 100,
        "explanation": "Văn hóa cách mạng là văn hóa vì nhân dân, phục vụ quần chúng công nông binh rộng lớn, đem lại đời sống văn hóa tinh thần phong phú cho nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "CULT_012",
        "category": "CULTURE",
        "type": "GUESE_THE_IDEA" if False else "GUESS_THE_IDEA",
        "difficulty": "MEDIUM",
        "question": "Giải mã luận điểm văn hóa kinh điển của Hồ Chí Minh:",
        "clues": [
            "Clue 1: Luận điểm này được Bác nhấn mạnh ngay sau khi Cách mạng Tháng Tám thành công.",
            "Clue 2: Luận điểm nêu rõ chức năng dẫn dắt tinh thần của văn hóa đối với toàn thể đồng bào cả nước.",
            "Clue 3: Gồm 8 chữ: 'Văn hóa ... cho ... đi'."
        ],
        "options": [
            "Văn hóa là chìa khóa mở mang trí tuệ",
            "Văn hóa soi đường cho quốc dân đi",
            "Văn hóa phục vụ cho mọi tầng lớp",
            "Văn hóa phát triển cùng kinh tế mới"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Chính là câu nói bất hủ: 'Văn hóa soi đường cho quốc dân đi'.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "CULT_013",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Theo Hồ Chí Minh, mối quan hệ giữa văn hóa với chính trị được biểu hiện như thế nào?",
        "options": [
            "Văn hóa đứng trên chính trị và điều hành chính trị",
            "Giải phóng chính trị mở đường cho văn hóa phát triển; văn hóa giải phóng lãnh đạo quốc dân thực hiện chính trị",
            "Chính trị và văn hóa độc lập tuyệt đối không tác động qua lại",
            "Văn hóa chỉ là công cụ hình thức của tuyên truyền hành chính"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Hồ Chí Minh chỉ rõ: chế độ chính trị giải phóng thì văn hóa mới được giải phóng. Ngược lại, văn hóa phải tham gia vào nhiệm vụ chính trị, thức tỉnh quần chúng để củng cố độc lập dân tộc và xây dựng chủ nghĩa xã hội.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 120"
    },
    {
        "id": "CULT_014",
        "category": "CULTURE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh cho rằng bảo tồn văn hóa truyền thống đồng nghĩa với việc giữ nguyên mọi tập tục cổ hủ không được thay đổi.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Sai. Hồ Chí Minh chủ trương kế thừa tinh hoa văn hóa truyền thống tốt đẹp, đồng thời kiên quyết bài trừ mê tín dị đoan, hủ tục lạc hậu.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "CULT_015",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Khi bàn về ngôn ngữ và chữ viết dân tộc, Hồ Chí Minh đã nhắc nhở điều gì?",
        "options": [
            "Nên dùng càng nhiều từ ngữ ngoại lai càng thể hiện tính hiện đại",
            "Tiếng nói của ta rất giàu và đẹp, phải giữ gìn sự trong sáng của tiếng Việt, không lạm dụng chữ ngoại",
            "Chỉ cần viết sao cho nhanh, không cần quan tâm đến chính tả và ngữ nghĩa",
            "Ngôn ngữ dân tộc không có khả năng diễn đạt các khái niệm khoa học hiện đại"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác luôn căn dặn phải yêu quý và giữ gìn sự trong sáng của tiếng Việt, tránh sính dùng chữ nước ngoài khi tiếng Việt đã có từ ngữ tương ứng diễn đạt rõ nghĩa.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 126"
    },
    {
        "id": "CULT_016",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Văn hóa nghệ thuật trong tư tưởng Hồ Chí Minh phải miêu tả điều gì chân thực nhất?",
        "options": [
            "Chỉ ca ngợi những cảnh thần tiên thoát ly hiện thực",
            "Hiện thực đời sống đấu tranh, lao động sản xuất và phẩm chất anh hùng của nhân dân",
            "Những nỗi buồn ủy mị, bế tắc của cá nhân",
            "Những hình ảnh hư cấu kỳ ảo không liên quan tới cuộc sống"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Người yêu cầu văn nghệ sĩ phải bám sát hiện thực đời sống, phản ánh chân thực cuộc chiến đấu anh dũng và lao động quên mình của nhân dân lao động.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 123"
    },
    {
        "id": "CULT_017",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Khái niệm 'Văn hóa tạo sức mạnh cộng đồng' trong tư tưởng Hồ Chí Minh thể hiện rõ nhất ở điểm nào?",
        "options": [
            "Văn hóa tập hợp, kết nối triệu con tim cùng chung lý tưởng độc lập dân tộc và tình yêu tổ quốc",
            "Văn hóa chỉ có tác dụng tạo ra các lễ hội vui chơi đông người",
            "Văn hóa phân chia cộng đồng thành các đẳng cấp khác nhau",
            "Văn hóa bắt buộc mọi cá nhân phải có sở thích giống hệt nhau"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Văn hóa bồi đắp lòng yêu nước, tinh thần đoàn kết, ý thức cộng đồng, tạo nên khối đại đoàn kết toàn dân tộc vững chắc, chuyển hóa thành sức mạnh vật chất to lớn trong kháng chiến và kiến quốc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "CULT_018",
        "category": "CULTURE",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Bác, tính chất 'Khoa học' của nền văn hóa mới đòi hỏi văn hóa phải chống lại những gì phản khoa học, mê tín, dị đoan.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Đúng. Tính khoa học đòi hỏi nền văn hóa phải dựa trên thế giới quan duy vật biện chứng, tôn trọng quy luật khách quan, bài trừ mê tín dị đoan và tư tưởng lạc hậu.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "CULT_019",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Tính chất 'Đại chúng' của nền văn hóa theo Hồ Chí Minh được hiểu là gì?",
        "options": [
            "Nền văn hóa phục vụ quảng đại quần chúng nhân dân và do chính nhân dân tham gia xây dựng",
            "Văn hóa chỉ phổ biến ở các thành phố lớn",
            "Văn hóa chỉ gồm những hình thức diễn xướng dân gian truyền thống",
            "Văn hóa hạ thấp trình độ chuyên môn để ai cũng làm được ngay"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Tính đại chúng biểu hiện ở chỗ văn hóa xuất phát từ nhân dân, phục vụ đại đa số nhân dân lao động, vì nhân dân và do nhân dân sáng tạo, hưởng thụ.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "CULT_020",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Để văn hóa thực sự là động lực phát triển, Hồ Chí Minh yêu cầu người làm văn hóa phải rèn luyện phẩm chất gì?",
        "options": [
            "Tìm cách làm hài lòng số ít giới phê bình hàn lâm",
            "Hòa mình vào đời sống công - nông - binh, sâu sát thực tiễn kháng chiến và sản xuất",
            "Tập trung sưu tầm đồ cổ quý hiếm",
            "Sống tách biệt với xã hội để tìm nguồn cảm hứng nghệ thuật"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác luôn khuyên các chiến sĩ văn hóa: 'Muốn tiến bộ, muốn viết hay thì phải đi vào thực tế, sâu sát quần chúng công nông binh để cảm nhận hơi thở thời đại.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 123"
    },
    {
        "id": "CULT_021",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Theo Hồ Chí Minh, luận điểm 'Văn hóa định hướng nhận thức' có ý nghĩa sâu xa nhất là gì?",
        "options": [
            "Văn hóa áp đặt suy nghĩ của người khác bằng mệnh lệnh hành chính",
            "Văn hóa giúp con người nhận thức đúng đắn về lẽ sống, phân biệt Chân - Thiện - Mỹ với cái xấu, cái ác, từ đó hành động có lý tưởng",
            "Văn hóa chỉ định hướng thói quen mua sắm tiêu dùng",
            "Văn hóa giới hạn tự do tư tưởng của công dân"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Văn hóa định hướng nhận thức là ngọn đèn soi rọi lý tưởng, giúp mỗi người tự ý thức về trách nhiệm công dân, phân biệt lẽ phải - trái, hướng tới những giá trị chân chính của đời sống.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "CULT_022",
        "category": "CULTURE",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Hồ Chí Minh chỉ ra nguyên tắc căn bản khi tiếp biến văn hóa thế giới: 'Tây phương hay Đông phương có cái gì tốt, ta học lấy để tạo ra một nền văn hóa...'",
        "options": [
            "...rập khuôn hoàn toàn theo nước ngoài",
            "...Việt Nam, mang bản sắc riêng, phục vụ cho độc lập tự do của dân tộc",
            "...chỉ dành riêng cho giới thượng lưu",
            "...không liên quan gì đến cội nguồn tổ tiên"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Hồ Chí Minh chủ trương: 'Học lấy cái tốt của cả Đông lẫn Tây để tạo ra một nền văn hóa Việt Nam', kết hợp nhuần nhuyễn giữa tinh hoa quốc tế và cội rễ dân tộc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    }
]

# 2. ETHICS (22 questions)
ethics_questions = [
    {
        "id": "ETH_001",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh so sánh vai trò của đạo đức đối với người cách mạng như thế nào?",
        "options": [
            "Như sông có nguồn, như cây có gốc",
            "Như chiếc áo đẹp mặc khi dự hội",
            "Như ngọn cỏ lướt theo chiều gió",
            "Như bức tranh trang trí cho đẹp phòng"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Trong tác phẩm Sửa đổi lối làm việc (1947), Người viết: 'Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 127"
    },
    {
        "id": "ETH_002",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Nội dung chuẩn mực đạo đức cốt lõi đầu tiên, bao trùm nhất của người cách mạng theo Hồ Chí Minh là gì?",
        "options": [
            "Làm giàu nhanh chóng cho bản thân",
            "Trung với nước, hiếu với dân",
            "Sống an phận, tránh va chạm",
            "Chỉ trung thành với bạn bè thân thiết"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Hồ Chí Minh đã kế thừa khái niệm trung, hiếu truyền thống và cách mạng hóa thành: 'Trung với nước, hiếu với dân' - suốt đời phấn đấu hy sinh vì độc lập dân tộc và hạnh phúc của nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 128"
    },
    {
        "id": "ETH_003",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Bốn phẩm chất đạo đức cách mạng gắn liền với nếp sống hằng ngày của cán bộ và công dân được Bác khái quát là gì?",
        "options": [
            "Nhân, Nghĩa, Lễ, Trí",
            "Cần, Kiệm, Liêm, Chính",
            "Dũng, Tín, Khiêm, Hòa",
            "Tự do, Bình đẳng, Bác ái, Công bằng"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Cần, Kiệm, Liêm, Chính là tứ đức cách mạng mà Bác thường xuyên nhắc nhở. Thiếu một đức thì không thành người.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 129"
    },
    {
        "id": "ETH_004",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Theo định nghĩa của Hồ Chí Minh, thế nào là 'Cần'?",
        "options": [
            "Chỉ làm việc nhiều giờ liên tục không cần nghỉ ngơi",
            "Siêng năng, chăm chỉ, cố gắng dẻo dai, làm việc có kế hoạch và đạt năng suất cao",
            "Chỉ làm việc khi có cấp trên giám sát",
            "Tìm mọi cách tranh việc của người khác"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Theo Bác, Cần không phải là làm việc bừa bãi hay kiệt sức, mà là cần cù, dẻo dai, có tính toán, có kế hoạch, có tổ chức để đạt năng suất, chất lượng cao nhất.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 129"
    },
    {
        "id": "ETH_005",
        "category": "ETHICS",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Theo Hồ Chí Minh, 'Kiệm' nghĩa là bủn xỉn, keo kiệt, không dám chi tiêu cho những việc cần thiết.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Sai. Hồ Chí Minh nhấn mạnh: Kiệm là tiết kiệm thì giờ, công sức, tiền của của dân, của nước; không hoang phí, nhưng việc đáng chi thì ngàn lượng vàng cũng phải chi, tuyệt đối không phải là bủn xỉn, keo kiệt.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 130"
    },
    {
        "id": "ETH_006",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Thế nào là 'Liêm' theo tư tưởng đạo đức Hồ Chí Minh?",
        "options": [
            "Luôn đòi hỏi quà biếu khi giúp đỡ người khác",
            "Trong sạch, không tham lam địa vị, tiền của, danh vọng; không lấy của chung làm của riêng",
            "Chỉ nhận hối lộ nếu không ai biết",
            "Lợi dụng sơ hở chính sách để trục lợi"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Liêm là trong sạch, không tham lam tiền tài, danh vọng; quang minh chính đại, chỉ có một lòng vì nước vì dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 130"
    },
    {
        "id": "ETH_007",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Người giải thích thế nào là 'Chính'?",
        "options": [
            "Chính là chức vụ chính thức trong cơ quan nhà nước",
            "Thẳng thắn, đứng đắn; việc thiện dù nhỏ mấy cũng làm, việc ác dù nhỏ mấy cũng tránh; đối với mình không tự cao, đối với người không nịnh hót",
            "Luôn áp đặt ý kiến cá nhân lên tập thể",
            "Chỉ xử lý công việc theo cảm tính cá nhân"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Chính nghĩa là thẳng thắn, đứng đắn. Đối với mình: không tự cao, tự đại; đối với người: không nịnh hót cấp trên, không khinh rẻ cấp dưới; đối với việc: để việc công lên trên việc tư.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 131"
    },
    {
        "id": "ETH_008",
        "category": "ETHICS",
        "type": "GUESS_THE_IDEA",
        "difficulty": "MEDIUM",
        "question": "Giải mã phẩm chất đạo đức đặc trưng của người cán bộ cách mạng qua các manh mối:",
        "clues": [
            "Clue 1: Bác dạy phẩm chất này là đỉnh cao của việc quét sạch chủ nghĩa cá nhân.",
            "Clue 2: Người giải thích: Đem lòng chí công mà xử sự, đặt lợi ích của Đảng, của nhân dân lên trên hết, trước hết.",
            "Clue 3: Cụm từ Hán - Việt gồm 4 chữ: '... công vô ...'"
        ],
        "options": [
            "Đại đoàn kết",
            "Chí công vô tư",
            "Cần kiệm liêm chính",
            "Tự lực cánh sinh"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Chính là phẩm chất 'Chí công vô tư'. Hồ Chí Minh giải thích chí công vô tư là hoàn toàn vì việc công, không có lòng tư túi hay thiên vị.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 131"
    },
    {
        "id": "ETH_009",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Nguyên tắc xây dựng đạo đức nào đòi hỏi cán bộ, đảng viên phải 'Nói đi đôi với làm'?",
        "options": [
            "Nguyên tắc tu dưỡng bền bỉ suốt đời",
            "Nguyên tắc nêu gương và thống nhất giữa lời nói với hành động",
            "Nguyên tắc tự phê bình hình thức",
            "Nguyên tắc giấu giếm khuyết điểm nội bộ"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Hồ Chí Minh đặc biệt coi trọng sự thống nhất giữa lời nói và việc làm: 'Nói thì phải làm, không được nói một đằng làm một nẻo, không được hứa suông.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 133"
    },
    {
        "id": "ETH_010",
        "category": "ETHICS",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh cho rằng: Một tấm gương sống còn có giá trị hơn một trăm bài diễn văn tuyên truyền.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Người luôn nhấn mạnh sức mạnh cảm hóa của sự nêu gương thực tế trong đạo đức và lối sống.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 134"
    },
    {
        "id": "ETH_011",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Trong nguyên tắc 'Xây đi đôi với chống', Hồ Chí Minh yêu cầu 'chống' cái gì quyết liệt nhất?",
        "options": [
            "Chống chủ nghĩa cá nhân - căn bệnh mẹ đẻ ra mọi thói hư tật xấu",
            "Chống những người có ý kiến phản biện thẳng thắn",
            "Chống việc học tập tri thức khoa học tiến bộ",
            "Chống sự phát triển kinh tế tư nhân hợp pháp"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Trong tác phẩm Nâng cao đạo đức cách mạng, quét sạch chủ nghĩa cá nhân (1969), Người chỉ rõ chủ nghĩa cá nhân là kẻ thù nguy hiểm số một bên trong mỗi con người.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 135"
    },
    {
        "id": "ETH_012",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Bác so sánh việc rèn luyện, tu dưỡng đạo đức với hình ảnh tự nhiên nào?",
        "options": [
            "Như hạt mưa rơi xuống đất",
            "Như ngọc càng mài càng sáng, vàng càng luyện càng trong",
            "Như hoa nở rồi tàn theo mùa",
            "Như đám mây trôi trên trời cao"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác viết: 'Đạo đức cách mạng không phải trên trời sa xuống. Nó do đấu tranh, rèn luyện bền bỉ hằng ngày mà phát triển và củng cố. Cũng như ngọc càng mài càng sáng, vàng càng luyện càng trong.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 136"
    },
    {
        "id": "ETH_013",
        "category": "ETHICS",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Bác Hồ, một người có tài giỏi đến đâu mà không có đạo đức thì vẫn có thể lãnh đạo tốt nhân dân.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Sai hoàn toàn. Bác khẳng định dứt khoát: 'Có tài mà không có đức là người vô dụng; có đức mà không có tài thì làm việc gì cũng khó.' Không có đạo đức thì dù tài giỏi mấy cũng không thể lãnh đạo nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 127"
    },
    {
        "id": "ETH_014",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Chuẩn mực 'Yêu thương con người, sống có tình có nghĩa' trong tư tưởng Hồ Chí Minh bắt nguồn từ đâu?",
        "options": [
            "Từ truyền thống nhân nghĩa, thương người như thể thương thân của dân tộc Việt Nam kết hợp với chủ nghĩa nhân đạo cộng sản",
            "Chỉ xuất phát từ lòng thương hại nhất thời",
            "Từ chính sách ngoại giao vụ lợi",
            "Từ yêu cầu hình thức của các nghi lễ cổ truyền"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Tình yêu thương con người ở Bác là sự kết tinh giữa chủ nghĩa nhân ái truyền thống Việt Nam và chủ nghĩa nhân văn Mác-Lênin, dành cho những người cùng khổ và quần chúng lao động.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 132"
    },
    {
        "id": "ETH_015",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Khi đối mặt với khuyết điểm của bản thân và đồng chí, phương pháp tốt nhất Bác chỉ ra là gì?",
        "options": [
            "Đóng cửa làm ngơ, giữ thể diện bằng mọi giá",
            "Thành khẩn tự phê bình và phê bình với tinh thần trị bệnh cứu người",
            "Công kích cá nhân gay gắt để triệt hạ uy tín",
            "Tìm lý do đổ lỗi cho hoàn cảnh khách quan"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác ví tự phê bình và phê bình như rửa mặt hằng ngày: phải trung thực, thẳng thắn và trên tinh thần đồng chí thương yêu lẫn nhau để cùng tiến bộ.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 134"
    },
    {
        "id": "ETH_016",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Chữ 'Trung' trong tư tưởng Hồ Chí Minh khác căn bản với chữ 'Trung' trong Nho giáo phong kiến ở điểm nào?",
        "options": [
            "Nho giáo trung với vua (quân vương); Hồ Chí Minh cách mạng hóa thành trung với nước, trung với sự nghiệp giải phóng dân tộc",
            "Không có điểm nào khác biệt",
            "Hồ Chí Minh chỉ yêu cầu trung với gia tộc dòng họ",
            "Nho giáo trung với nhân dân hơn Hồ Chí Minh"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Trong đạo đức phong kiến, 'trung' là trung quân mù quáng ('quân xử thần tử, thần bất tử bất trung'). Hồ Chí Minh đã vượt qua hạn chế đó: 'Trung với nước, hiếu với dân', đặt lợi ích của Tổ quốc và nhân dân lên tối thượng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 128"
    },
    {
        "id": "ETH_017",
        "category": "ETHICS",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Bác dạy: Đạo đức cách mạng không phải là đạo đức khổ hạnh hay thủ tiêu lợi ích chính đáng của cá nhân.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Đạo đức cách mạng tôn trọng lợi ích cá nhân chính đáng, hòa quyện lợi ích cá nhân trong lợi ích tập thể và quốc gia, chỉ chống chủ nghĩa cá nhân ích kỷ, hẹp hòi.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 132"
    },
    {
        "id": "ETH_018",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Hồ Chí Minh coi ba thứ 'giặc nội xâm' nguy hiểm làm suy thoái đạo đức là gì?",
        "options": [
            "Giặc đói, giặc dốt, giặc ngoại xâm",
            "Tham ô, lãng phí, quan liêu",
            "Thiếu ăn, thiếu mặc, thiếu học",
            "Mê tín, lười biếng, cờ bạc"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Người chỉ rõ: Tham ô, lãng phí, quan liêu là thứ giặc ở trong lòng, là giặc nội xâm, phá hoại sự nghiệp cách mạng từ bên trong nguy hiểm không kém giặc ngoại xâm.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 135"
    },
    {
        "id": "ETH_019",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Ý nghĩa của chuẩn mực 'Tinh thần quốc tế trong sáng' trong tư tưởng đạo đức Hồ Chí Minh là gì?",
        "options": [
            "Đoàn kết với giai cấp vô sản và các dân tộc bị áp bức, tôn trọng độc lập chủ quyền, vì hòa bình và công lý quốc tế",
            "Can thiệp vào công việc nội bộ của các quốc gia khác",
            "Từ bỏ quyền lợi của quốc gia dân tộc mình",
            "Chỉ liên minh với các nước giàu có để tranh thủ viện trợ"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Tinh thần quốc tế trong sáng thể hiện tinh thần thủy chung, chí nghĩa chí tình với bạn bè năm châu theo nguyên lý 'Bốn phương vô sản đều là anh em'.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 132"
    },
    {
        "id": "ETH_020",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Hồ Chí Minh căn dặn điều gì về nguy cơ thoái hóa đạo đức của cán bộ khi Đảng đã nắm chính quyền?",
        "options": [
            "Khi có quyền lực thì tự khắc đạo đức sẽ trong sáng hơn",
            "Cán bộ dễ biến thành 'quan cách mạng', lộng quyền, đè đầu cưỡi cổ dân nếu không thường xuyên tu dưỡng",
            "Chỉ cần có bằng cấp cao là kiểm soát được tha hóa quyền lực",
            "Nắm chính quyền là nhiệm vụ cuối cùng, không cần rèn luyện nữa"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Bác luôn cảnh báo: Người cán bộ khi nắm chính quyền rất dễ sa vào căn bệnh 'làm quan phát tài', cậy quyền cậy thế, biến vị trí công bộc của dân thành ông quan cai trị.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 135"
    },
    {
        "id": "ETH_021",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Trong Di chúc (1969), điều đầu tiên Bác căn dặn về Đảng sau khi kháng chiến thắng lợi là gì?",
        "options": [
            "Chia thưởng ngay cho các cơ quan trung ương",
            "Việc cần phải làm trước tiên là chỉnh đốn lại Đảng, mỗi đảng viên và đoàn viên phải thật sự thấm nhuần đạo đức cách mạng",
            "Tập trung đầu tư xây dựng các công trình kỷ niệm hoành tráng",
            "Giảm bớt các tiêu chuẩn đạo đức để kết nạp thật nhanh"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Trong Di chúc, Người nhấn mạnh: 'Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta... Đảng ta là một Đảng cầm quyền. Mỗi đảng viên và cán bộ phải thật sự thấm nhuần đạo đức cách mạng, thật sự cần kiệm liêm chính, chí công vô tư.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 136"
    },
    {
        "id": "ETH_022",
        "category": "ETHICS",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Thước đo cao nhất của đạo đức cách mạng theo quan điểm Hồ Chí Minh là gì?",
        "options": [
            "Khả năng hùng biện lý luận trước đám đông",
            "Mức độ hoàn thành nhiệm vụ và sự hài lòng, hạnh phúc của nhân dân",
            "Số lượng danh hiệu khen thưởng cá nhân tích lũy được",
            "Thời gian công tác lâu năm trong bộ máy"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Đạo đức cách mạng không đo bằng lời nói suông mà đo bằng hành động cụ thể: sự tận tụy phụng sự Tổ quốc và được nhân dân tin yêu, kính trọng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 133"
    }
]

# 3. HUMAN (22 questions)
human_questions = [
    {
        "id": "HUM_001",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh quan niệm con người trong tính chỉnh thể như thế nào?",
        "options": [
            "Con người chỉ đơn thuần là sinh vật tự nhiên tìm kiếm thức ăn",
            "Con người là một thể thống nhất hữu cơ giữa mặt sinh học và mặt xã hội",
            "Con người là sản phẩm của các thế lực siêu nhiên thần thánh",
            "Con người chỉ tồn tại như một công cụ lao động cơ bắp"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Hồ Chí Minh nhìn nhận con người cụ thể, lịch sử, là sự thống nhất hài hòa giữa thể xác và tinh thần, giữa phương diện sinh học và các quan hệ xã hội phong phú.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 137"
    },
    {
        "id": "HUM_002",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Theo tư tưởng Hồ Chí Minh, con người giữ vị trí như thế nào trong sự nghiệp cách mạng?",
        "options": [
            "Chỉ là phương tiện tạm thời phục vụ chiến tranh",
            "Vừa là mục tiêu cao nhất, vừa là động lực quyết định của cách mạng",
            "Chỉ là đối tượng thụ động chịu sự quản lý",
            "Là nhân tố thứ yếu sau vũ khí và trang thiết bị kỹ thuật"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Hồ Chí Minh khẳng định: Con người là mục tiêu của giải phóng dân tộc, giải phóng xã hội; đồng thời nhân dân là người làm nên lịch sử, là động lực to lớn nhất của mọi thắng lợi.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_003",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Câu nói nổi tiếng của Bác mượn ý người xưa về tầm quan trọng của chiến lược phát triển con người là:",
        "options": [
            "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người",
            "Nuôi quân ba năm, dùng một giờ",
            "Đi một ngày đàng, học một sàng khôn",
            "Có công mài sắt, có ngày nên kim"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Phát biểu tại lớp học chính trị giáo viên cấp II, III toàn miền Bắc (1958), Bác nhấn mạnh: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 139"
    },
    {
        "id": "HUM_004",
        "category": "HUMAN",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Theo Hồ Chí Minh, muốn xây dựng chủ nghĩa xã hội thì trước hết cần có những con người xã hội chủ nghĩa.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Người khẳng định: 'Muốn xây dựng chủ nghĩa xã hội, trước hết cần có những con người xã hội chủ nghĩa.' Con người là nhân tố quyết định thành bại của công cuộc đổi mới và phát triển.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 139"
    },
    {
        "id": "HUM_005",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Mô hình con người toàn diện theo tư tưởng Hồ Chí Minh phải kết hợp hài hòa hai yếu tố nào?",
        "options": [
            "Vừa giàu có vừa nổi tiếng",
            "Vừa 'hồng' vừa 'chuyên' (đạo đức cách mạng vững vàng và trình độ chuyên môn nghiệp vụ giỏi)",
            "Chỉ cần trung thành, không cần giỏi chuyên môn",
            "Chỉ cần bằng cấp quốc tế, không cần lập trường chính trị"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Hồ Chí Minh yêu cầu đào tạo con người phải 'vừa hồng vừa chuyên'. 'Hồng' là đạo đức, lý tưởng cách mạng; 'chuyên' là năng lực tri thức, tay nghề giỏi.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 140"
    },
    {
        "id": "HUM_006",
        "category": "HUMAN",
        "type": "GUESS_THE_IDEA",
        "difficulty": "MEDIUM",
        "question": "Giải mã chiến lược cốt lõi trong tư tưởng Hồ Chí Minh qua 3 manh mối:",
        "clues": [
            "Clue 1: Đây là công việc bền bỉ, lâu dài của toàn Đảng, toàn dân và cả hệ thống giáo dục.",
            "Clue 2: Chiến lược này được Người đặt ở tầm nhìn 'trăm năm'.",
            "Clue 3: Mục tiêu là đào tạo thế hệ tương lai kế tục sự nghiệp cách mạng trung kiên và tài giỏi."
        ],
        "options": [
            "Chiến lược công nghiệp hóa",
            "Chiến lược 'Trồng người'",
            "Chính sách ngoại giao cây tre",
            "Chiến lược quốc phòng toàn dân"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Đó chính là chiến lược 'Trồng người' - một cống hiến lý luận vô cùng đặc sắc của Hồ Chí Minh về phát triển nhân lực con người Việt Nam.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 139"
    },
    {
        "id": "HUM_007",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Khi xem xét con người, phương pháp luận của Hồ Chí Minh có đặc điểm nổi bật nào?",
        "options": [
            "Nhìn nhận con người trừu tượng, chung chung phi giai cấp",
            "Xem xét con người trong các mối quan hệ xã hội cụ thể, gắn với hoàn cảnh lịch sử và vị trí công tác cụ thể",
            "Chỉ đánh giá con người qua nguồn gốc xuất thân gia đình",
            "Đánh giá con người cố định, không tin vào khả năng biến đổi tiến bộ của con người"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Hồ Chí Minh luôn nhìn nhận con người biện chứng, cụ thể trong từng mối quan hệ: với gia đình, bạn bè, đồng chí, nhân dân và quốc tế; tin vào thiện căn và khả năng vươn lên của mỗi cá nhân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 137"
    },
    {
        "id": "HUM_008",
        "category": "HUMAN",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Bác Hồ dạy rằng: Trong mỗi con người đều có cái thiện và cái ác, cái hay và cái dở cùng tồn tại.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Bác nói: 'Trong quả tim mỗi người đều có cái thiện và cái ác... Ta phải làm cho phần thiện trong mỗi con người nảy nở như hoa mùa xuân và phần ác mất dần đi.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_009",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Để phát huy vai trò động lực của con người, Hồ Chí Minh yêu cầu điều gì quan trọng nhất?",
        "options": [
            "Sử dụng mệnh lệnh hành chính cưỡng chế",
            "Chăm lo đời sống vật chất và tinh thần của nhân dân, tôn trọng quyền làm chủ của nhân dân",
            "Áp đặt kỷ luật sắt mà không giải thích lý do",
            "Chỉ đãi ngộ vật chất cho cấp lãnh đạo"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Động lực con người chỉ được giải phóng mạnh mẽ nhất khi quyền lợi của họ được chăm lo, quyền làm chủ được bảo đảm và tinh thần tự giác yêu nước được khơi dậy.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_010",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Quan điểm của Hồ Chí Minh về việc giải phóng con người bao gồm những nội dung căn bản nào?",
        "options": [
            "Chỉ giải phóng về mặt cá nhân khỏi sự ràng buộc gia đình",
            "Giải phóng dân tộc, giải phóng giai cấp, giải phóng xã hội và giải phóng triệt để từng con người khỏi áp bức, bóc lột và ngu dốt",
            "Chỉ giải phóng cho người lao động cơ bắp, bỏ qua trí thức",
            "Cho phép cá nhân tự do vi phạm pháp luật tập thể"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Giải phóng con người theo Hồ Chí Minh là một sự nghiệp toàn diện: giành độc lập cho Tổ quốc, đánh đổ chế độ bóc lột, xóa bỏ dốt nát nghèo đói để con người làm chủ vận mệnh chính mình.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 137"
    },
    {
        "id": "HUM_011",
        "category": "HUMAN",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Bác Hồ, cán bộ lãnh đạo không cần tôn trọng tài năng cá nhân của cấp dưới, chỉ cần họ biết tuân lệnh.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Sai. Hồ Chí Minh yêu cầu phải biết quý trọng nhân tài, biết 'dụng nhân như dụng mộc', tùy tài mà dùng người đúng lúc, đúng việc để mỗi người phát huy tối đa sở trường.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 141"
    },
    {
        "id": "HUM_012",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Mục tiêu tột bậc trong cả cuộc đời hoạt động của Hồ Chí Minh là gì?",
        "options": [
            "Có được chức vụ quyền lực cao nhất",
            "Nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn, áo mặc, ai cũng được học hành",
            "Trở thành một học giả lý luận nổi tiếng thế giới",
            "Xây dựng quân đội tinh nhuệ nhất khu vực"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Trả lời các nhà báo nước ngoài đầu năm 1946, Bác nói: 'Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_013",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Theo Bác, yếu tố nào là điều kiện tiên quyết để xây dựng con người mới xã hội chủ nghĩa?",
        "options": [
            "Sự tự rèn luyện, tự tu dưỡng của mỗi cá nhân kết hợp với giáo dục của nhà trường, gia đình và xã hội",
            "Chỉ phụ thuộc vào cơ chế khen thưởng bằng tiền bạc",
            "Chờ đợi khi xã hội hoàn toàn giàu có thì con người tự khắc tốt lên",
            "Chỉ áp dụng kỷ luật trừng phạt nghiêm khắc"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Bác dạy việc rèn luyện con người cần kết hợp 'tam giác giáo dục': Gia đình - Nhà trường - Xã hội, nhưng nhân tố quyết định trực tiếp là ý thức tự tu dưỡng của chính bản thân người đó.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 140"
    },
    {
        "id": "HUM_014",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Biểu hiện cụ thể của con người có phẩm chất 'Hồng' trong học tập và công tác hiện nay là gì?",
        "options": [
            "Luôn hô vang các khẩu hiệu lý luận mà không chịu học bài",
            "Có bản lĩnh chính trị vững vàng, trung thực, trách nhiệm, sống có đạo đức và gắn bó với tập thể, đất nước",
            "Thụ động chấp nhận mọi ý kiến của người khác",
            "Tự cho mình quyền coi thường những người có chuyên môn giỏi"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "'Hồng' thể hiện ở tinh thần trách nhiệm, lòng yêu nước chân chính, lối sống trung thực, không tham nhũng tiêu cực, luôn hướng tới lợi ích cộng đồng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 140"
    },
    {
        "id": "HUM_015",
        "category": "HUMAN",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh khẳng định: Muốn lãnh đạo quần chúng thì người cán bộ trước hết phải làm gương mẫu trước quần chúng.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Nêu gương là phương pháp thuyết phục quần chúng có sức mạnh nhất trong tư tưởng Hồ Chí Minh.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 141"
    },
    {
        "id": "HUM_016",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Khi bàn về thanh niên - rường cột nước nhà, Bác ví thế hệ trẻ như mùa nào trong năm?",
        "options": [
            "Mùa xuân của xã hội",
            "Mùa hè sôi động",
            "Mùa thu thanh bình",
            "Mùa đông kiên cường"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Bác viết thư gửi thanh niên: 'Một năm khởi đầu từ mùa xuân. Một đời khởi đầu từ tuổi trẻ. Tuổi trẻ là mùa xuân của xã hội.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 142"
    },
    {
        "id": "HUM_017",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Theo Hồ Chí Minh, con người với tư cách là 'mục tiêu của cách mạng' đòi hỏi Đảng và Nhà nước phải làm gì?",
        "options": [
            "Không ngừng nâng cao đời sống ấm no, bảo vệ quyền con người, quyền công dân và tạo mọi điều kiện để mỗi người phát triển tự do, toàn diện",
            "Yêu cầu nhân dân hy sinh tuyệt đối không được đòi hỏi quyền lợi gì",
            "Tập trung ngân sách cho các dự án xa hoa",
            "Giao phó toàn bộ trách nhiệm xã hội cho các tổ chức quốc tế"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Mục tiêu của cách mạng là vì hạnh phúc của nhân dân: 'Nếu nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_018",
        "category": "HUMAN",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Bác dạy phải có thái độ phê phán nhưng nhân ái, rộng lượng đối với những người lầm đường lạc lối nếu họ biết hối cải.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Đúng. Tinh thần khoan dung, độ lượng là nét đặc sắc trong văn hóa ứng xử và quan điểm nhân văn Hồ Chí Minh.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "HUM_019",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Quan điểm xây dựng con người mới về mặt thể chất được Hồ Chí Minh phát động qua phong trào nào?",
        "options": [
            "Phong trào rèn luyện thân thể, nâng cao sức khỏe toàn dân ('Khỏe để phụng sự Tổ quốc')",
            "Chỉ tuyển chọn vận động viên chuyên nghiệp đi thi đấu",
            "Tập trung uống thuốc bổ đắt tiền",
            "Nghỉ ngơi không cần vận động thể thao"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Tháng 3/1946, Bác viết Lời kêu gọi toàn dân tập thể dục: 'Giữ gìn dân chủ, xây dựng nước nhà... tất cả đều nhờ sức khỏe mới làm thành công. Dân cường thì nước thịnh.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 140"
    },
    {
        "id": "HUM_020",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Tính nhân văn sâu sắc nhất trong tư tưởng Hồ Chí Minh về con người là gì?",
        "options": [
            "Xem con người là phương tiện để hoàn thành các mục tiêu kinh tế lớn",
            "Lòng tin vô hạn vào sức mạnh, trí tuệ và phẩm giá của quần chúng nhân dân",
            "Tập trung quyền lực vào số ít tinh hoa",
            "Cho rằng chỉ có lãnh tụ mới làm nên lịch sử"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Điểm cốt lõi trong tư tưởng Hồ Chí Minh là đức tin kiên định vào nhân dân: 'Dễ trăm lần không dân cũng chịu, khó vạn lần dân liệu cũng xong.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 137"
    },
    {
        "id": "HUM_021",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Để bồi dưỡng thế hệ cách mạng cho đời sau, Bác căn dặn đó là một việc như thế nào trong Di chúc?",
        "options": [
            "Việc phụ, khi nào rảnh rỗi mới làm",
            "Một việc rất quan trọng và rất cần thiết",
            "Việc của riêng ngành công an",
            "Việc chỉ áp dụng cho con em cán bộ cấp cao"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Trong Di chúc, Bác viết: 'Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 142"
    },
    {
        "id": "HUM_022",
        "category": "HUMAN",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Mối quan hệ biện chứng giữa con người là mục tiêu và con người là động lực được thể hiện ra sao?",
        "options": [
            "Mục tiêu và động lực triệt tiêu lẫn nhau trong thực tế",
            "Càng phát huy tốt động lực con người thì càng nhanh đạt tới mục tiêu; ngược lại, hiện thực hóa mục tiêu chăm lo con người lại càng nhân lên động lực",
            "Chỉ cần chú trọng mục tiêu, động lực sẽ tự nhiên xuất hiện mà không cần tác động",
            "Động lực chỉ tồn tại trong thời chiến, mục tiêu chỉ tồn tại trong thời bình"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Đây là mối quan hệ tương hỗ: chăm lo hạnh phúc của nhân dân (mục tiêu) sẽ kích hoạt sức sáng tạo và lòng cống hiến quên mình của nhân dân (động lực).",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    }
]

# 4. EDUCATION (18 questions)
education_questions = [
    {
        "id": "EDU_001",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh đã chỉ rõ mục đích cốt lõi của việc học là:",
        "options": [
            "Học để lấy bằng cấp cao để khoe mẽ",
            "Học để làm việc, làm người, làm cán bộ",
            "Học để kiếm được nhiều tiền bằng mọi giá",
            "Học để thăng quan tiến chức dễ dàng"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác ghi trong sổ vàng Trường Nguyễn Ái Quốc (1949): 'Học để làm việc, làm người, làm cán bộ. Học để phụng sự Đoàn thể, phụng sự giai cấp và nhân dân, phụng sự Tổ quốc và nhân loại.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_002",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Ngay sau ngày Tuyên ngôn Độc lập (1945), Bác đã chỉ ra ba thứ giặc cần phải đánh gục, trong đó có giặc nào về giáo dục?",
        "options": [
            "Giặc nội xâm",
            "Giặc dốt",
            "Giặc lười",
            "Giặc kiêu"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Trong phiên họp đầu tiên của Chính phủ lâm thời (3/9/1945), Người xếp 'Giặc dốt' là một trong ba thứ giặc khẩn cấp (Giặc đói, Giặc dốt, Giặc ngoại xâm).",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_003",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Phong trào xóa mù chữ quy mô toàn quốc được Bác phát động năm 1945 có tên gọi là gì?",
        "options": [
            "Phong trào Ánh sáng văn hóa",
            "Phong trào Bình dân học vụ",
            "Phong trào Thi đua ái quốc",
            "Phong trào Ba sẵn sàng"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Phong trào 'Bình dân học vụ' với khẩu hiệu 'Người biết chữ dạy người chưa biết chữ' đã giúp hàng triệu người dân Việt Nam thoát nạn mù chữ thần kỳ.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_004",
        "category": "EDUCATION",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh khẳng định: Một dân tộc dốt là một dân tộc yếu.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Người nhấn mạnh dốt nát khiến nhân dân không hiểu được quyền lợi và nghĩa vụ của mình, dễ bị kẻ địch lừa gạt, làm đất nước suy yếu.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_005",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Nguyên lý giáo dục căn bản nào luôn được Hồ Chí Minh nhắc nhở thầy trò?",
        "options": [
            "Học thuộc lòng sách giáo khoa là đủ",
            "Học đi đôi với hành, lý luận gắn liền với thực tiễn",
            "Học lý thuyết thật cao siêu, không cần làm việc thực tế",
            "Học chỉ để đi thi cử lấy điểm số"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Hồ Chí Minh chỉ rõ: 'Học mà không hành thì vô ích. Hành mà không học thì không minh.' Giáo dục phải gắn chặt với thực tiễn lao động và chiến đấu.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_006",
        "category": "EDUCATION",
        "type": "GUESS_THE_IDEA",
        "difficulty": "HARD",
        "question": "Giải mã phương châm tự học của Bác qua 3 manh mối:",
        "clues": [
            "Clue 1: Bác áp dụng phương châm này từ khi bôn ba nước ngoài cho đến tận những năm tháng cuối đời.",
            "Clue 2: Phương châm đề cao tính kiên trì, không bao giờ tự mãn với vốn hiểu biết sẵn có.",
            "Clue 3: Lời dạy: 'Còn sống thì còn phải ...'"
        ],
        "options": [
            "Làm việc không ngừng",
            "Học suốt đời (Học, học nữa, học mãi)",
            "Tiết kiệm chi tiêu",
            "Rèn luyện thể thao"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Đó là tinh thần 'Học suốt đời'. Bác từng nói: 'Đường đời là một cái thang không có nấc chót; việc học là một quyển sách không có trang cuối cùng. Còn sống là còn phải học.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_007",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Nội dung giáo dục toàn diện theo tư tưởng Hồ Chí Minh bao gồm những mặt nào?",
        "options": [
            "Chỉ tập trung học ngoại ngữ",
            "Đức, Trí, Thể, Mỹ (Giáo dục đạo đức, tri thức, thể chất và thẩm mỹ)",
            "Chỉ học các môn khoa học tự nhiên",
            "Chỉ tập trung rèn luyện võ thuật"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Giáo dục toàn diện theo Bác phải phát triển hài hòa cả thể lực, trí lực, phẩm chất đạo đức và năng lực cảm thụ cái đẹp Chân - Thiện - Mỹ.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_008",
        "category": "EDUCATION",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Theo Hồ Chí Minh, thầy giáo và cô giáo giữ vai trò quyết định đối với chất lượng giáo dục trong nhà trường.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Bác căn dặn: 'Không có thầy giáo thì không có giáo dục... Thầy giáo, cô giáo là những người chiến sĩ vẻ vang trên mặt trận văn hóa giáo dục.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_009",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Phương pháp giáo dục mà Hồ Chí Minh phê phán gay gắt nhất là gì?",
        "options": [
            "Dạy học nêu vấn đề gợi mở",
            "Nhồi sọ, học vẹt, dạy lý thuyết suông tách rời đời sống",
            "Cho học sinh thực hành ngoài công trường",
            "Khuyến khích học sinh thảo luận tranh luận khoa học"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác kịch liệt phản đối lối dạy 'nhồi sọ', bắt học thuộc lòng như vẹt mà không hiểu bản chất, không biết vận dụng vào thực tế giải quyết vấn đề.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_010",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Bác căn dặn học sinh, sinh viên khi tiếp nhận kiến thức từ sách vở phải có thái độ như thế nào?",
        "options": [
            "Tin tưởng tuyệt đối 100% không bao giờ suy ngẫm",
            "Phải độc lập suy nghĩ, không học vẹt, phải biết đào sâu suy nghĩ và liên hệ với thực tiễn",
            "Chỉ học những gì thi, không cần đọc thêm sách",
            "Chỉ tin vào ý kiến cá nhân trên mạng xã hội"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác luôn khuyên học sinh phải có tinh thần tự chủ, độc lập suy nghĩ, biết đào sâu nghiên cứu chứ không thụ động ghi chép.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_011",
        "category": "EDUCATION",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Hồ Chí Minh cho rằng người có bằng cấp cao đương nhiên là người có đạo đức và văn hóa tốt.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Sai. Bác phân biệt rất rõ giữa bằng cấp học vấn với đạo đức nhân cách. Bằng cấp cao mà ích kỷ, tham nhũng, coi thường nhân dân thì càng gây hại cho xã hội.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 127"
    },
    {
        "id": "EDU_012",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Trong bức thư gửi các em học sinh nhân ngày khai trường đầu tiên của nước Việt Nam Dân chủ Cộng hòa (9/1945), Bác đã gửi gắm niềm tin vào thế hệ trẻ bằng câu nói nào?",
        "options": [
            "Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em",
            "Thanh niên phải lo làm giàu cho bản thân trước tiên",
            "Học tập là việc nhẹ nhàng nhất trong các nghề",
            "Chỉ cần bảo vệ biên giới, học hành tính sau"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đó là bức thư lịch sử gửi học sinh cả nước tháng 9/1945, thể hiện niềm kỳ vọng lớn lao vào sứ mệnh học tập của thế hệ mầm non tương lai.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_013",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Mối quan hệ giữa giáo dục trong nhà trường với giáo dục gia đình và xã hội theo quan điểm Hồ Chí Minh là gì?",
        "options": [
            "Nhà trường chịu trách nhiệm 100%, gia đình không cần quan tâm",
            "Sự phối hợp chặt chẽ, thống nhất giữa Gia đình - Nhà trường - Xã hội để tạo môi trường giáo dục đồng bộ",
            "Xã hội chỉ có trách nhiệm tài trợ kinh phí",
            "Mỗi bên hoạt động độc lập và phủ nhận phương pháp của nhau"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác dạy: 'Giáo dục trong nhà trường chỉ là một phần, còn cần có sự giáo dục ngoài xã hội và trong gia đình để giúp cho việc giáo dục trong nhà trường được tốt hơn.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 140"
    },
    {
        "id": "EDU_014",
        "category": "EDUCATION",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh tự học ngoại ngữ bằng cách mỗi ngày học và ghi nhớ một số từ vựng, viết lên cánh tay và thực hành ngay trong giao tiếp hàng ngày.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Đó là tấm gương tự học phi thường của Bác: kiên trì, biến mỗi hoàn cảnh lao động khó khăn trên tàu buôn thành lớp học thực tiễn.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_015",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Đối với phong trào thi đua trong ngành giáo dục, Bác đã căn dặn khẩu hiệu cốt lõi nào?",
        "options": [
            "Dạy thật nhanh, học thật gấp",
            "Dù khó khăn đến đâu cũng phải tiếp tục thi đua Dạy tốt và Học tốt",
            "Chỉ thi đua lấy thành tích hình thức",
            "Dành mọi thời gian làm kinh tế phụ"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Trong bức thư cuối cùng gửi ngành giáo dục (15/10/1968), Bác căn dặn: 'Dù khó khăn đến đâu cũng phải tiếp tục thi đua dạy tốt và học tốt.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 125"
    },
    {
        "id": "EDU_016",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Khái niệm 'Học để làm người' trong tư tưởng Hồ Chí Minh đặt nền móng cốt lõi vào điều gì?",
        "options": [
            "Học cách luồn lách để mưu lợi cho bản thân",
            "Học đạo đức, nhân cách, biết yêu thương đồng bào, có trách nhiệm với cộng đồng và giữ lòng trung thực, liêm khiết",
            "Học cách phô trương bằng cấp danh vị",
            "Chỉ học các kỹ năng ứng xử xã giao bề ngoài"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "'Làm người' theo Bác là cái gốc đầu tiên trước khi 'làm cán bộ'. Làm người là sống nhân nghĩa, có lý tưởng, có đạo đức, phụng sự nhân dân và Tổ quốc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_017",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Tại sao Hồ Chí Minh coi giáo dục là động lực phát triển then chốt của quốc gia?",
        "options": [
            "Vì giáo dục trực tiếp nâng cao dân trí, đào tạo nhân lực, bồi dưỡng nhân tài - nguồn lực nội sinh vô tận của đất nước",
            "Vì giáo dục giúp in ấn được nhiều tài liệu quảng bá",
            "Vì trường học là nơi tập trung đông dân cư nhất",
            "Vì giáo dục chỉ là tiêu chí để vay vốn quốc tế"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Giáo dục giải phóng tiềm năng trí tuệ con người, biến một dân tộc nghèo nàn lạc hậu thành một dân tộc có tri thức, làm chủ khoa học công nghệ để bảo vệ và dựng xây đất nước.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "EDU_018",
        "category": "EDUCATION",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Thông điệp 'Học để phụng sự' của Hồ Chí Minh mang ý nghĩa xã hội gì sâu sắc đối với sinh viên thời đại số?",
        "options": [
            "Tri thức học được không phải để trục lợi ích kỷ mà phải chuyển hóa thành giá trị phụng sự cộng đồng và phát triển quốc gia",
            "Chỉ học những gì phục vụ nhu cầu giải trí cá nhân",
            "Học chỉ để đi làm thuê kiếm tiền lương cao mà không cần quan tâm đến đạo đức nghề nghiệp",
            "Học xong thì quên hết trách nhiệm với quê hương"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Mục đích chân chính của học vấn là phụng sự: đem tài năng, công nghệ và trí tuệ giải quyết những bài toán của đất nước, nâng cao đời sống nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    }
]

# 5. PRACTICE (22 questions)
practice_questions = [
    {
        "id": "PRAC_001",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Theo Hồ Chí Minh, thước đo cao nhất để kiểm nghiệm chân lý và hiệu quả của mọi đường lối, chính sách là gì?",
        "options": [
            "Những bài diễn văn hùng hồn trên giấy",
            "Thực tiễn đời sống và sự ấm no, hài lòng của nhân dân",
            "Số lượng con dấu phê duyệt hành chính",
            "Ý kiến chủ quan của cán bộ cấp cao"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Hồ Chí Minh chỉ rõ: Thực tiễn là thước đo chân lý. Một chính sách hay lý luận dù viết hay đến đâu mà không mang lại kết quả thực tế cho dân thì cũng chỉ là sáo rỗng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_002",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Căn bệnh nào bị Bác Hồ phê bình nghiêm khắc nhất khi cán bộ chỉ nói lý thuyết hay mà không biết làm việc thực tế?",
        "options": [
            "Bệnh lý luận suông, xa rời thực tế",
            "Bệnh tự ti mặc cảm",
            "Bệnh quá khiêm tốn",
            "Bệnh làm việc quá nhiều"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Trong tác phẩm Sửa đổi lối làm việc, Bác chỉ rõ 'bệnh lý luận suông' - học thuộc vẹt từng câu của Mác - Lênin nhưng khi gặp công việc cụ thể thì lúng túng, không biết giải quyết.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_003",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Hồ Chí Minh dạy phương châm kết hợp giữa lý luận và thực tiễn như thế nào?",
        "options": [
            "Lý luận đi một đường, thực tế làm một nẻo",
            "Lý luận phải đem ra áp dụng vào thực tế; lý luận mà không liên hệ với thực tế là lý luận suông; thực tiễn mà không có lý luận hướng dẫn là thực tiễn mù quáng",
            "Chỉ cần thực tiễn làm mò mẫm, không cần lý luận",
            "Chỉ cần đọc sách lý luận, không cần đi thực tế cơ sở"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Hồ Chí Minh nhấn mạnh sự thống nhất biện chứng giữa lý luận và thực tiễn. Lý luận chỉ dẫn cho hành động, thực tiễn kiểm nghiệm và làm phong phú thêm lý luận.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_004",
        "category": "PRACTICE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Hồ Chí Minh yêu cầu người cán bộ khi xuống cơ sở phải 'ba cùng' với nhân dân: Cùng ăn, cùng ở, cùng làm.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Đó là phương pháp bám sát thực tiễn để thấu hiểu tâm tư, nguyện vọng chính đáng của đồng bào.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_005",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Để chủ trương, nghị quyết đi vào cuộc sống thực tế, Bác dạy khâu nào giữ vai trò then chốt?",
        "options": [
            "Chỉ cần tổ chức lễ phát động thật hoành tráng",
            "Khâu tổ chức thực hiện, đôn đốc kiểm tra và tổng kết kinh nghiệm",
            "In thật nhiều biểu ngữ treo khắp các phố",
            "Chờ đợi các địa phương khác làm trước rồi copy"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác dạy: 'Chủ trương một, biện pháp mười, quyết tâm phải hai mươi.' Nếu không có biện pháp tổ chức và kiểm tra sâu sát thì chủ trương đúng cũng nằm trên giấy.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_006",
        "category": "PRACTICE",
        "type": "GUESS_THE_IDEA",
        "difficulty": "MEDIUM",
        "question": "Giải mã nguyên tắc thực tiễn tối cao của Hồ Chí Minh qua 3 manh mối:",
        "clues": [
            "Clue 1: Nguyên tắc này đòi hỏi sự trung thực tuyệt đối giữa phát ngôn và hành vi.",
            "Clue 2: Đối lập hoàn toàn với thói 'nói một đằng làm một nẻo' hay 'hứa hão'.",
            "Clue 3: Gồm 5 chữ: 'Nói ... đôi với ...'"
        ],
        "options": [
            "Nói nhiều hơn làm",
            "Nói đi đôi với làm",
            "Làm theo người khác",
            "Nói lời hay ý đẹp"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Đó là nguyên tắc 'Nói đi đôi với làm' - phẩm chất danh dự hàng đầu của người hành động cách mạng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 133"
    },
    {
        "id": "PRAC_007",
        "category": "PRACTICE",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Bác, kiểm tra thực tế là việc vạch lá tìm sâu để trừng phạt cán bộ cấp dưới.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Sai. Bác dạy: Kiểm tra là để thấy rõ ưu điểm mà khen ngợi, phát huy; thấy khuyết điểm mà uốn nắn, giúp đỡ kịp thời trước khi sai lầm trở nên trầm trọng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_008",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Khi nghiên cứu kinh nghiệm cách mạng của các nước bạn, phương châm thực tiễn của Bác là gì?",
        "options": [
            "Rập khuôn máy móc từng câu chữ và mô hình của nước ngoài về áp dụng",
            "Học tập kinh nghiệm quý báu của bạn nhưng phải căn cứ vào hoàn cảnh thực tế đặc thù của Việt Nam để sáng tạo",
            "Tuyệt đối không học hỏi bất cứ điều gì từ bên ngoài",
            "Chỉ làm theo chỉ dẫn của các chuyên gia nước ngoài"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác luôn phản đối giáo điều, sao chép máy móc: 'Mỗi nước có hoàn cảnh riêng, ta phải xuất phát từ thực tiễn Việt Nam để tìm ra con đường đi đúng đắn.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_009",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Thực hiện 'Dân biết, dân bàn, dân làm, dân kiểm tra' phản ánh quan điểm thực tiễn nào của Hồ Chí Minh?",
        "options": [
            "Cách mạng là sự nghiệp của quần chúng nhân dân",
            "Dân chỉ việc đóng thuế, còn mọi việc để chính quyền lo",
            "Cán bộ không cần giải trình với nhân dân",
            "Chỉ cho dân biết những việc đã hoàn thành"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đưa nhân dân vào thực tiễn quản lý, giám sát là bảo đảm cao nhất cho quyền làm chủ thực tế của nhân dân theo tư tưởng Hồ Chí Minh.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương IV & VI"
    },
    {
        "id": "PRAC_010",
        "category": "PRACTICE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Bác dạy: Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Đây là bức thư Bác gửi Ủy ban nhân dân các kỳ, tỉnh, huyện và làng vào tháng 10/1945, xác lập tiêu chuẩn thực tiễn cho mọi công vụ.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 128"
    },
    {
        "id": "PRAC_011",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Hồ Chí Minh phê phán tác phong làm việc nào dẫn đến xa rời thực tế đời sống nhân dân?",
        "options": [
            "Tác phong sâu sát cơ sở",
            "Tác phong quan liêu, hách dịch, ngồi bàn giấy chỉ đạo qua báo cáo",
            "Tác phong giản dị, gần gũi",
            "Tác phong dân chủ, lắng nghe"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bệnh quan liêu là gốc rễ của việc xa rời thực tế: cán bộ chỉ ngồi phòng lạnh chỉ tay năm ngón, không biết dân đang thiếu đói hay bức xúc điều gì.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 135"
    },
    {
        "id": "PRAC_012",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Để rèn luyện phong cách công tác thực tế, Bác dạy người cán bộ phải có 'óc nghĩ, mắt trông, tai nghe, chân đi, miệng nói, tay làm'. Nội dung này nhấn mạnh điều gì?",
        "options": [
            "Sự vận động thể lực để biểu diễn sức khỏe",
            "Sự dấn thân hành động toàn diện, sâu sát thực tế đời sống chứ không làm việc nửa vời",
            "Phải làm mọi việc thay cho cấp dưới",
            "Chỉ nói những điều người nghe thích nghe"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Trong bài báo 'Dân vận' (1949), Bác yêu cầu phong cách công tác thực tế: phải tự mình suy nghĩ, quan sát, lắng nghe và trực tiếp hành động cùng dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_013",
        "category": "PRACTICE",
        "type": "TRUE_FALSE",
        "difficulty": "MEDIUM",
        "question": "Theo Hồ Chí Minh, thực tiễn luôn biến đổi không ngừng, do đó chủ trương chính sách cũng phải linh hoạt điều chỉnh cho phù hợp thực tiễn.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Đúng. Đó là phương châm 'Dĩ bất biến, ứng vạn biến' - giữ vững mục tiêu độc lập dân tộc và CNXH, nhưng sách lược phải thiên biến vạn hóa theo thực tiễn.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_014",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "EASY",
        "question": "Khi lập kế hoạch công việc, Bác căn dặn cần tránh căn bệnh nào sau đây?",
        "options": [
            "Lập kế hoạch quá chi tiết, có dự phòng rủi ro",
            "Lập kế hoạch viển vông, vẽ hươu vẽ vượn không dựa trên nguồn lực thực tế",
            "Bàn bạc dân chủ với các thành viên",
            "Xác định rõ người chịu trách nhiệm"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Kế hoạch phải sát thực tế, tính toán kỹ lưỡng điều kiện con người và vật chất, không được 'đao to búa lớn' rồi bỏ dở giữa chừng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_015",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Hồ Chí Minh chỉ rõ tác hại của bệnh hình thức trong thực tiễn là gì?",
        "options": [
            "Tạo ra vẻ hào nhoáng bề ngoài nhưng bên trong rỗng tuếch, gây tốn kém tiền bạc và làm mất niềm tin của nhân dân",
            "Giúp công việc hoàn thành nhanh hơn",
            "Nâng cao tinh thần trách nhiệm của cán bộ",
            "Tiết kiệm ngân sách nhà nước"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Bệnh hình thức là thứ độc hại: báo cáo láo, phô trương giả tạo, làm sai lệch hiện thực khiến việc hoạch định chính sách bị chệch hướng.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_016",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Quan điểm thực tiễn của Hồ Chí Minh về việc sửa đổi lề lối làm việc nhằm mục đích gì cao nhất?",
        "options": [
            "Làm cho bộ máy phục vụ nhân dân nhanh chóng, hiệu quả, tận tụy và tiết kiệm nhất",
            "Tạo thêm nhiều thủ tục giấy tờ hành chính",
            "Tăng quyền lực cho cán bộ trung gian",
            "Cắt giảm mọi sự tương tác giữa chính quyền với công dân"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Sửa đổi lối làm việc là để cán bộ gần dân hơn, loại bỏ tệ cửa quyền phiền hà, biến bộ máy thành công bộc thực sự của nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_017",
        "category": "PRACTICE",
        "type": "TRUE_FALSE",
        "difficulty": "EASY",
        "question": "Trong lao động và sản xuất, Bác Hồ luôn động viên các sáng kiến cải tiến kỹ thuật xuất phát từ chính công nhân và nông dân.",
        "options": ["Đúng", "Sai"],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đúng. Bác khẳng định sáng kiến từ thực tiễn sản xuất của người lao động là nguồn tài nguyên sáng tạo vô giá.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_018",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Bác giải thích câu ngạn ngữ 'Có thực mới vực được đạo' theo góc nhìn thực tiễn như thế nào?",
        "options": [
            "Con người phải được ăn no, mặc ấm, đời sống vật chất được bảo đảm thì mới có thể bàn đến việc tu dưỡng đạo đức và lý tưởng",
            "Chỉ cần ăn uống xa xỉ, đạo đức tự khắc có",
            "Phủ nhận hoàn toàn vai trò của đời sống tinh thần",
            "Khuyên mọi người chỉ tích lũy của cải vật chất"
        ],
        "correctAnswer": 0,
        "points": 200,
        "explanation": "Bác luôn xuất phát từ thực tiễn nhu cầu sinh tồn cơ bản của con người: trước hết phải giải quyết cái ăn, cái mặc, nhà ở cho dân rồi mới phát huy đạo đức và văn hóa.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 120"
    },
    {
        "id": "PRAC_019",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "HARD",
        "question": "Khi phát hiện một chủ trương không còn phù hợp với thực tiễn, thái độ đúng đắn theo tư tưởng Hồ Chí Minh là:",
        "options": [
            "Cố chấp giữ nguyên để bảo vệ uy tín cơ quan ban hành",
            "Dũng cảm thừa nhận, nhanh chóng nghiên cứu thực tế để sửa đổi và bổ sung kịp thời",
            "Đổ lỗi cho người dân không chịu thực hiện",
            "Giấu nhẹm đi và ban hành tiếp chính sách sai khác"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Thước đo của người lãnh đạo chân chính là lòng dũng cảm nhìn thẳng vào sự thật, tôn trọng thực tiễn khách quan để sửa sai kịp thời.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 143"
    },
    {
        "id": "PRAC_020",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Phương pháp công tác 'Từ quần chúng mà ra, trở lại nơi quần chúng' của Bác có bản chất là gì?",
        "options": [
            "Thu thập ý kiến phân tán của quần chúng, dùng lý luận đúc kết thành chính sách đúng, rồi đem tuyên truyền giải thích cho quần chúng hiểu và tự giác thực hiện",
            "Bắt buộc quần chúng phải đồng ý với mọi quyết định có sẵn",
            "Chỉ đi dạo một vòng cơ sở để lấy ảnh tư liệu",
            "Đẩy toàn bộ quyết định khó khăn cho dân tự chịu trách nhiệm"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Đây là phương pháp lãnh đạo quần chúng kinh điển của Hồ Chí Minh, bảo đảm mọi đường lối chính sách đều bắt nguồn từ đời sống và quay trở lại phục vụ đời sống.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    },
    {
        "id": "PRAC_021",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "BOSS",
        "question": "Bài học lớn nhất từ phong cách thực tiễn Hồ Chí Minh đối với việc xây dựng Nhà nước pháp quyền hiện nay là gì?",
        "options": [
            "Luật pháp ban hành phải xuất phát từ thực tiễn xã hội, lấy sự phục vụ nhân dân làm mục tiêu cao nhất và được thực thi nghiêm minh",
            "Chỉ cần dịch các đạo luật nước ngoài về ban hành",
            "Tăng số lượng luật càng nhiều càng tốt dù không ai áp dụng được",
            "Coi trọng thủ tục hành chính hơn quyền lợi của công dân"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Pháp luật thực chất là bảo đảm công lý và quyền làm chủ của nhân dân, xuất phát từ hơi thở thực tiễn cuộc sống chứ không phải ý chí chủ quan áp đặt.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương IV & VI"
    },
    {
        "id": "PRAC_022",
        "category": "PRACTICE",
        "type": "MCQ",
        "difficulty": "MEDIUM",
        "question": "Theo Bác Hồ, một nghị quyết dù đúng đến mấy nhưng không có sự đồng thuận và chung tay của quần chúng trong thực tế thì sẽ như thế nào?",
        "options": [
            "Vẫn tự động thành công",
            "Sẽ chỉ là một mẩu giấy vô dụng không có sức sống",
            "Trở thành di sản vĩ đại",
            "Được quốc tế khen ngợi"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác từng ví: Nghị quyết mà không biến thành hành động thực tế của hàng triệu người dân thì chẳng khác gì 'nước đổ lá khoai'.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 144"
    }
]

# 6. REAL LIFE (28 questions)
real_life_questions = [
    {
        "id": "REAL_001",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Minh có một bài thuyết trình lớn trong 7 ngày tới. Tuy nhiên, Minh thường dành phần lớn thời gian để lướt mạng xã hội và chơi game, tự nhủ 'còn nhiều thời gian'. Đến đêm trước ngày nộp bài, Minh mới vội vàng thức trắng đêm làm qua loa.",
        "question": "Hành động nào của Minh sau đây sẽ vận dụng đúng chữ 'CẦN' theo tư tưởng Hồ Chí Minh?",
        "options": [
            "Chờ đến hạn chót rồi mới làm để có áp lực sáng tạo",
            "Sao chép nguyên văn bài làm của nhóm khác trên mạng",
            "Chủ động lập kế hoạch làm việc theo từng ngày, kiên trì nghiên cứu tài liệu từ sớm và kiểm tra kỹ lưỡng",
            "Nhờ bạn cùng lớp làm hộ và trả tiền thù lao"
        ],
        "correctAnswer": 2,
        "points": 100,
        "explanation": "Bác Hồ dạy: 'Cần' là siêng năng, dẻo dai, nhưng phải có kế hoạch, có phương pháp để đạt năng suất và chất lượng cao, chứ không phải lười biếng rồi làm gấp gáp qua quýt.",
        "sourceTag": "Vận dụng Đạo đức: Chữ 'Cần'"
    },
    {
        "id": "REAL_002",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Trong một buổi thảo luận nhóm đại học, Lan được phân công làm phần tổng hợp số liệu. Nhận thấy có công cụ AI tạo văn bản nhanh, Lan đã copy toàn bộ câu lệnh và dán bài nộp mà không hề đọc lại nội dung hay kiểm tra tính chính xác của các số liệu giả do AI sinh ra.",
        "question": "Vận dụng nguyên lý 'Học đi đôi với hành' và phẩm chất 'Chính trực' của Bác, Lan nên xử lý thế nào?",
        "options": [
            "Sử dụng AI như công cụ tham khảo, tự mình kiểm chứng dữ liệu, hiểu bản chất kiến thức và ghi rõ nguồn gốc",
            "Tuyệt đối cấm không được sử dụng máy tính hay công nghệ mới",
            "Tiếp tục nộp bài sao chép vì giảng viên không có thời gian phát hiện",
            "Đổ lỗi cho công cụ AI nếu nhóm bị điểm kém"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Bác dạy học tập phải thực chất, độc lập suy nghĩ. AI là công cụ hỗ trợ hiện đại, nhưng người học phải kiểm chứng, làm chủ tri thức và giữ gìn liêm chính học thuật.",
        "sourceTag": "Vận dụng Giáo dục & Liêm chính học thuật"
    },
    {
        "id": "REAL_003",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "CLB sinh viên của Tuấn được cấp một khoản kinh phí hoạt động từ trường. Sau khi tổ chức xong sự kiện còn thừa lại 3 triệu đồng. Một số bạn gợi ý chia nhau số tiền này để đi ăn uống riêng vì 'thủ quỹ quyết toán hợp thức hóa hóa đơn rất dễ'.",
        "question": "Hành động nào sau đây thể hiện đúng chữ 'LIÊM' và 'CHÍ CÔNG VÔ TƯ' của Bác Hồ?",
        "options": [
            "Chia đều số tiền cho ban chủ nhiệm CLB coi như tiền công",
            "Công khai tài chính minh bạch, hoàn trả số tiền thừa vào quỹ chung của CLB hoặc nộp lại nhà trường",
            "Mua hóa đơn khống để bù vào khoản tiền đã tiêu",
            "Gửi số tiền vào tài khoản cá nhân để tiêu dùng riêng"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Chữ 'Liêm' trong tư tưởng Bác là trong sạch, không tham một đồng xu cắc bạc của công; 'Chí công vô tư' là đặt sự minh bạch và lợi ích tập thể lên trên sự tư lợi cá nhân.",
        "sourceTag": "Vận dụng Đạo đức: Chữ 'Liêm'"
    },
    {
        "id": "REAL_004",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trên không gian mạng xuất hiện một bài viết có thông tin phiến diện, sai sự thật về lịch sử văn hóa dân tộc, kích động phân biệt vùng miền để câu view. Dưới bài viết, hàng trăm bình luận chửi bới lẫn nhau.",
        "question": "Là một sinh viên có văn hóa và nhận thức theo tư tưởng Hồ Chí Minh, bạn nên ứng xử như thế nào?",
        "options": [
            "Hùa theo chửi bới bằng những lời lẽ tục tĩu để giải tỏa cảm xúc",
            "Bình tĩnh kiểm chứng nguồn tin chính thống, phản biện văn minh bằng luận cứ khoa học hoặc báo cáo vi phạm tiêu chuẩn cộng đồng",
            "Chia sẻ ngay bài viết về trang cá nhân để bạn bè cùng tranh cãi tiêu cực",
            "Ủng hộ việc phân biệt vùng miền để chia rẽ đoàn kết"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Văn hóa Hồ Chí Minh là văn hóa đoàn kết, tôn trọng sự thật và hướng tới sự nhân văn. Người trẻ cần tỉnh táo trước 'bẫy tin giả' trên mạng xã hội, giữ gìn sự văn minh và đoàn kết dân tộc.",
        "sourceTag": "Vận dụng Văn hóa & Môi trường số"
    },
    {
        "id": "REAL_005",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Hoàng nhận thấy ký túc xá có tình trạng nhiều bạn bật đèn, quạt và mở vòi nước chảy tự do rồi bỏ đi ra ngoài hàng giờ, khiến tiền điện nước tăng vọt và gây lãng phí tài nguyên.",
        "question": "Vận dụng chữ 'KIỆM' theo tư tưởng Hồ Chí Minh vào sinh hoạt hàng ngày, thái độ đúng đắn là gì?",
        "options": [
            "Cho rằng tiền chia đều cả phòng nên cứ xài thoải mái",
            "Chủ động tắt các thiết bị khi không sử dụng, sử dụng nước hợp lý và nhắc nhở các bạn cùng phòng thực hiện nếp sống tiết kiệm",
            "Bỏ mặc vì đây không phải việc riêng của mình",
            "Phá hỏng thêm các thiết bị công cộng"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác Hồ dạy: 'Kiệm' là tiết kiệm của công từ những việc nhỏ nhất như hạt gạo, ngọn đèn, giọt nước. Tiết kiệm không chỉ bảo vệ túi tiền mà còn thể hiện văn hóa sống văn minh.",
        "sourceTag": "Vận dụng Đạo đức: Chữ 'Kiệm'"
    },
    {
        "id": "REAL_006",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trong bài tập nhóm gồm 5 thành viên, có bạn Huy rất ít khi tham gia họp, không chịu làm việc được giao với lý do 'bận việc riêng', nhưng đến khi nộp bài lại xin ghi tên mình với mức đánh giá đóng góp tối đa (100%).",
        "question": "Vận dụng nguyên tắc 'Xây đi đôi với chống' và tinh thần phê bình chân thành của Bác, nhóm trưởng nên xử lý thế nào?",
        "options": [
            "Cả nể đồng ý ghi 100% để giữ hòa khí bề ngoài",
            "Thẳng thắn trao đổi, góp ý mang tính xây dựng cho Huy; đánh giá đúng tỷ lệ đóng góp thực tế và báo cáo trung thực với giảng viên",
            "Chửi bới và cô lập Huy trên mạng xã hội",
            "Bỏ luôn bài tập nhóm không nộp nữa"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác dạy đoàn kết phải gắn với đấu tranh chống thói ỷ lại, tự phê bình và phê bình với tinh thần chân thành giúp nhau tiến bộ, đánh giá công bằng dựa trên thực tiễn cống hiến.",
        "sourceTag": "Vận dụng Tinh thần làm việc nhóm"
    },
    {
        "id": "REAL_007",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Một nhóm sinh viên công nghệ thông tin phát hiện một lỗ hổng bảo mật nghiêm trọng trong hệ thống cổng thông tin của trường, cho phép xem trộm điểm số và dữ liệu cá nhân của các sinh viên khác.",
        "question": "Hành vi nào thể hiện phẩm chất 'Vừa hồng vừa chuyên' và ý thức công dân chuẩn mực?",
        "options": [
            "Tự ý khai thác lỗ hổng để sửa điểm cho bản thân và bạn bè",
            "Rao bán thông tin lỗ hổng trên các diễn đàn 'hắc ám' kiếm tiền",
            "Báo cáo chi tiết lỗ hổng và đề xuất giải pháp vá lỗi kịp thời cho bộ phận kỹ thuật của trường",
            "Khoe khoang trên mạng xã hội để thể hiện đẳng cấp hacker"
        ],
        "correctAnswer": 2,
        "points": 300,
        "explanation": "Người có chuyên môn giỏi ('chuyên') phải đi kèm với đạo đức liêm chính và trách nhiệm xã hội ('hồng'). Dùng tri thức để bảo vệ hệ thống và giúp đỡ cộng đồng là tinh thần của người trí thức xã hội chủ nghĩa.",
        "sourceTag": "Vận dụng 'Vừa hồng vừa chuyên' trong công nghệ"
    },
    {
        "id": "REAL_008",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Hội đồng đánh giá luận văn phát hiện một đề tài tốt nghiệp có tỷ lệ trùng lặp đạo văn tới 60% từ một luận văn đã công bố năm trước, chỉ đổi tên địa phương nghiên cứu.",
        "question": "Hành vi đạo văn này vi phạm nghiêm trọng nhất chuẩn mực đạo đức nào của Hồ Chí Minh?",
        "options": [
            "Vi phạm chuẩn mực Cần kiệm",
            "Vi phạm chuẩn mực Liêm, Chính và tinh thần Nói đi đôi với làm trong học thuật",
            "Chỉ là vi phạm hình thức trình bày văn bản",
            "Không vi phạm vì tri thức là của nhân loại"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Đạo văn là sự gian lận trí tuệ, vi phạm sự trung thực (Chính) và trong sạch (Liêm). Học tập chân chính phải là sự tự thân sáng tạo và lao động nghiêm túc.",
        "sourceTag": "Vận dụng Liêm chính học thuật"
    },
    {
        "id": "REAL_009",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Khi giao tiếp và viết bài luận, một số sinh viên có thói quen chêm quá nhiều từ tiếng Anh không cần thiết vào câu tiếng Việt (ví dụ: 'Mình thấy cái idea này rất là make sense cho team work').",
        "question": "Vận dụng lời dặn của Bác về việc giữ gìn sự trong sáng của tiếng Việt, bạn nên thay đổi thói quen này thế nào?",
        "options": [
            "Tiếp tục chêm càng nhiều từ ngoại ngữ càng tốt để chứng tỏ mình hội nhập",
            "Ý thức sử dụng từ ngữ tiếng Việt chuẩn xác, giàu biểu cảm; chỉ dùng thuật ngữ quốc tế khi tiếng Việt chưa có từ tương đương",
            "Từ bỏ hoàn toàn việc học tiếng Anh",
            "Chỉ nói tiếng lóng viết tắt trên mọi văn bản"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác luôn căn dặn phải giữ gìn sự trong sáng của tiếng Việt - tiếng nói vô cùng phong phú và đẹp đẽ của tổ tiên, không nên sính ngoại lố lăng.",
        "sourceTag": "Vận dụng Bản sắc văn hóa & Tiếng Việt"
    },
    {
        "id": "REAL_010",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Một bạn sinh viên đạt danh hiệu sinh viên xuất sắc toàn khóa, nắm rất vững các định nghĩa lý luận triết học và tư tưởng Hồ Chí Minh, nhưng khi trường phát động chiến dịch 'Mùa hè xanh' giúp đỡ đồng bào vùng lũ thì bạn từ chối tham gia vì 'sợ bẩn và mất thời gian nghỉ dưỡng'.",
        "question": "Theo tiêu chuẩn 'Học để phụng sự' và mối quan hệ Lý luận - Thực tiễn của Bác, trường hợp này mắc phải hạn chế gì?",
        "options": [
            "Là tấm gương hoàn hảo về việc chỉ cần học giỏi lý thuyết",
            "Mắc bệnh lý luận suông, thiếu gắn bó với thực tiễn đời sống nhân dân, chưa thấu hiểu triết lý học để làm người và cống hiến",
            "Rất thực tế vì biết tiết kiệm sức lực cá nhân",
            "Hoàn toàn đúng vì sinh viên giỏi không cần lao động chân tay"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Học lý luận HCM không phải để thi lấy điểm 10 rồi cất tủ, mà phải biến thành tình cảm yêu thương con người và hành động dấn thân giúp đỡ cộng đồng.",
        "sourceTag": "Vận dụng Lý luận gắn với thực tiễn"
    },
    {
        "id": "REAL_011",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Mai là lớp trưởng. Trong đợt bình xét học bổng khuyến khích, có hai bạn điểm rèn luyện ngang nhau. Một bạn là bạn thân cùng phòng với Mai, bạn kia ít nói và không thân thiết. Nếu Mai chấm điểm thiên vị cho bạn thân, bạn ấy sẽ được học bổng.",
        "question": "Phẩm chất 'CHÍ CÔNG VÔ TƯ' của Hồ Chí Minh đòi hỏi Mai phải quyết định thế nào?",
        "options": [
            "Ưu tiên cộng điểm cho bạn thân vì tình bạn quan trọng hơn quy chế",
            "Khách quan, công tâm, căn cứ chính xác vào tiêu chuẩn minh bạch của nhà trường, không để tình cảm riêng chi phối việc công",
            "Tự ý giữ lại học bổng cho bản thân",
            "Bốc thăm ngẫu nhiên để trốn tránh trách nhiệm"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "'Chí công vô tư' đòi hỏi người làm công tác tập thể phải công bằng, chính trực, đặt công lý và quy chế chung lên trên cảm tình bè phái cá nhân.",
        "sourceTag": "Vận dụng Chí công vô tư trong lớp học"
    },
    {
        "id": "REAL_012",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Sau một buổi liên hoan âm nhạc tại công viên thành phố, nhiều nhóm bạn trẻ đứng dậy ra về để lại hàng ngàn vỏ chai nhựa, túi ni-lông bừa bãi trên bãi cỏ công cộng.",
        "question": "Hành động nào của một công dân có nếp sống 'Văn hóa mới' theo Bác Hồ?",
        "options": [
            "Cũng vứt rác theo vì 'ai cũng vứt thì mình vứt'",
            "Chủ động dọn dẹp rác của nhóm mình, bỏ đúng nơi quy định và cùng hỗ trợ gom rác chung giữ gìn cảnh quan sạch đẹp",
            "Chụp ảnh rác đăng lên mạng chê bai rồi bỏ đi không nhặt",
            "Đá rác sang khu vực của người khác"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Xây dựng đời sống mới, nếp sống mới bắt đầu từ những hành động văn minh nhỏ nhất: tôn trọng không gian chung, giữ gìn vệ sinh môi trường và có ý thức cộng đồng.",
        "sourceTag": "Vận dụng Nếp sống văn hóa mới"
    },
    {
        "id": "REAL_013",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trên trang cá nhân, một người bạn thường xuyên chia sẻ những bài viết bi quan, chán chường, khuyên mọi người không cần cố gắng học tập vì 'thời buổi này chỉ cần quan hệ và tiền bạc'.",
        "question": "Vận dụng tinh thần 'Văn hóa soi đường' và niềm tin vào ý chí con người của Bác, bạn nên suy nghĩ thế nào?",
        "options": [
            "Tin theo tư tưởng tiêu cực đó và ngừng phấn đấu",
            "Giữ vững bản lĩnh và niềm tin vào giá trị của sự nỗ lực chân chính; văn hóa tích cực giúp con người nuôi dưỡng khát vọng và vượt qua nghịch cảnh",
            "Rủ rê thêm nhiều người cùng suy nghĩ bi quan",
            "Bỏ học để đi tìm các mối quan hệ ảo"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Văn hóa có chức năng bồi dưỡng tư tưởng đúng đắn, tình cảm cao đẹp và niềm tin vào tương lai. Thanh niên cần có sức đề kháng trước những tư tưởng độc hại, bi quan yếm thế.",
        "sourceTag": "Vận dụng Bản lĩnh tư tưởng"
    },
    {
        "id": "REAL_014",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Khi tham gia giao thông giờ cao điểm, thấy đèn đỏ còn 5 giây và vỉa hè trống, nhiều người xung quanh bấm còi giục giã và lao xe lên vỉa hè để đi trước. Bạn đang đi ở phía trước.",
        "question": "Hành động nào thể hiện chữ 'CHÍNH' (thẳng thắn, đúng đắn, việc thiện nhỏ mấy cũng làm, việc ác nhỏ mấy cũng tránh)?",
        "options": [
            "Cũng phóng lên vỉa hè theo đám đông cho đỡ chậm giờ",
            "Kiên nhẫn dừng đúng vạch chờ đèn xanh, không lấn làn leo vỉa hè dù xung quanh có người thúc giục",
            "Quay lại cãi nhau gay gắt với người bấm còi gây ùn tắc thêm",
            "Tắt máy đứng giữa ngã tư phản đối"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Chữ 'Chính' của Bác dạy người cách mạng không a dua theo cái sai của đám đông; việc tuân thủ pháp luật giao thông dù nhỏ nhưng là biểu hiện của phẩm chất tự trọng và tôn trọng cộng đồng.",
        "sourceTag": "Vận dụng Đạo đức: Chữ 'Chính'"
    },
    {
        "id": "REAL_015",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trong giờ thi môn HCM202, bạn ngồi cạnh lén mang điện thoại vào phòng thi và nhờ bạn che mắt giám thị để chụp đề gửi lên nhóm mạng xã hội nhờ giải hộ.",
        "question": "Theo nguyên tắc 'Trung thực' và đạo đức cách mạng, bạn nên xử sự ra sao?",
        "options": [
            "Nhiệt tình che chắn giúp bạn vì 'tinh thần đoàn kết anh em'",
            "Từ chối tiếp tay cho hành vi gian lận và khuyên bạn tự giác làm bài trung thực",
            "Xin cùng chép đáp án từ chiếc điện thoại đó",
            "Đòi bạn trả tiền thì mới chịu che giúp"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác dạy đoàn kết phải trên cơ sở nguyên tắc đúng đắn, không thể bao che dung túng cho cái sai. Liêm chính trong thi cử là thước đo nhân cách đầu tiên của sinh viên.",
        "sourceTag": "Vận dụng Liêm chính thi cử"
    },
    {
        "id": "REAL_016",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Được nghỉ hè 2 tháng, một bạn sinh viên chỉ ở trong phòng lướt điện thoại ngày đêm, ăn uống thất thường và không tham gia bất kỳ hoạt động thể chất hay giao tiếp xã hội nào.",
        "question": "Lời khuyên nào sau đây phù hợp nhất với lời dạy của Bác về rèn luyện con người phát triển toàn diện?",
        "options": [
            "Tiếp tục ở yên trong phòng để tránh tốn tiền",
            "Cân đối thời gian rèn luyện thân thể (tập thể dục thể thao), đọc sách nâng cao dân trí và tham gia các hoạt động thiện nguyện xã hội",
            "Dành toàn bộ 2 tháng chỉ để chơi game kiếm tiền ảo",
            "Không cần vận động vì tuổi trẻ tự có sức khỏe"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác luôn dạy thanh niên phải phát triển hài hòa: 'Khỏe để xây dựng và bảo vệ Tổ quốc', rèn luyện cả thể lực lẫn trí lực và kỹ năng sống.",
        "sourceTag": "Vận dụng Rèn luyện toàn diện"
    },
    {
        "id": "REAL_017",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Một doanh nghiệp phần mềm đưa ra lời mời sinh viên thực tập phát triển một ứng dụng đánh bạc trực tuyến ngụy trang trò chơi dân gian với mức thù lao rất cao.",
        "question": "Vận dụng quan điểm 'Đạo đức là gốc' và mục tiêu phục vụ nhân dân của Bác, sinh viên nên quyết định thế nào?",
        "options": [
            "Chấp nhận ngay vì thù lao cao, hậu quả xã hội tính sau",
            "Kiên quyết từ chối vì công việc đó vi phạm pháp luật và tạo ra tệ nạn gây hại cho các gia đình và xã hội",
            "Làm một thời gian kiếm đủ tiền rồi mới nghỉ",
            "Rủ thêm các bạn cùng lớp tham gia để nhận hoa hồng"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Làm kinh tế hay làm kỹ thuật phải có đạo đức nghề nghiệp. Bác dạy 'tài' phải đi đôi với 'đức', không thể vì đồng tiền mà tiếp tay cho những tệ nạn làm băng hoại đạo đức xã hội.",
        "sourceTag": "Vận dụng Đạo đức nghề nghiệp"
    },
    {
        "id": "REAL_018",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trong một chuyến du lịch đến di tích lịch sử đền chùa cổ kính, một nhóm bạn trẻ đã dùng bút xóa khắc tên mình lên các cột gỗ di tích để 'lưu niệm tình yêu'.",
        "question": "Hành vi này thể hiện sự thiếu hụt nghiêm trọng về yếu tố nào trong tư tưởng Hồ Chí Minh?",
        "options": [
            "Thiếu hụt kỹ năng viết chữ đẹp",
            "Ý thức văn hóa bảo tồn di sản dân tộc và sự tôn trọng các giá trị lịch sử văn hóa chung",
            "Thiếu dụng cụ khắc chuyên nghiệp",
            "Không vi phạm vì thể hiện tình cảm cá nhân tự nhiên"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Di sản văn hóa là tài sản thiêng liêng của dân tộc được Bác nhắc nhở phải trân trọng gìn giữ cho muôn đời sau. Hành vi bôi bẩn di tích là biểu hiện của sự vô văn hóa.",
        "sourceTag": "Vận dụng Bảo tồn di sản văn hóa"
    },
    {
        "id": "REAL_019",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Mỗi khi nhận được phản hồi góp ý từ thầy cô giáo về lỗi sai trong bài nghiên cứu khoa học, Nam thường tỏ ra bực bội, khó chịu và cho rằng thầy cô đang 'bắt bẻ' mình.",
        "question": "Vận dụng bài học 'Tự phê bình và phê bình' của Bác, Nam nên điều chỉnh thái độ như thế nào?",
        "options": [
            "Lên mạng xã hội bóng gió nói xấu thầy cô",
            "Lắng nghe với tinh thần cầu thị, nhận diện khuyết điểm để sửa chữa và hoàn thiện chất lượng công trình nghiên cứu",
            "Bỏ đề tài nghiên cứu không làm nữa",
            "Tranh cãi gay gắt bất chấp đúng sai"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác ví phê bình như chiếc gương soi khuyết điểm và liều thuốc chữa bệnh. Cầu thị trước lời phê bình là tố chất tiên quyết của người học chân chính muốn tiến bộ.",
        "sourceTag": "Vận dụng Tự phê bình trong học tập"
    },
    {
        "id": "REAL_020",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Tại một diễn đàn giao lưu sinh viên quốc tế, một số sinh viên cảm thấy tự ti khi thấy các bạn nước ngoài có điều kiện vật chất và công nghệ tốt hơn, dẫn đến tâm lý rụt rè không dám trình bày nét đẹp văn hóa truyền thống của quê hương mình.",
        "question": "Học tập tinh thần 'Tự lực tự cường' và hội nhập quốc tế của Bác Hồ khi ra đi tìm đường cứu nước, các bạn nên làm gì?",
        "options": [
            "Càng che giấu cội nguồn của mình và cố gắng bắt chước hoàn toàn người nước ngoài",
            "Tự tin, tự hào về bản sắc văn hóa dân tộc, chủ động cởi mở giao lưu, tiếp thu tinh hoa thế giới trên nền tảng cốt cách Việt Nam",
            "Rút lui khỏi diễn đàn để tránh so sánh",
            "Có thái độ thù địch vô căn cứ với bạn bè quốc tế"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Bác bôn ba khắp năm châu với hai bàn tay trắng nhưng luôn ngẩng cao đầu tự hào là người Việt Nam. Tự tin văn hóa và tinh thần tự lực là chìa khóa để hội nhập quốc tế thành công.",
        "sourceTag": "Vận dụng Hội nhập quốc tế & Tự tôn dân tộc"
    },
    {
        "id": "REAL_021",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Huy được bầu làm lớp phó phụ trách phong trào học tập. Huy muốn các bạn trong lớp nâng cao điểm số nhưng bản thân Huy lại thường xuyên đi học muộn, không làm bài tập về nhà.",
        "question": "Khuyết điểm của Huy vi phạm nguyên tắc phương pháp luận nào của Bác Hồ?",
        "options": [
            "Nguyên tắc tiết kiệm thì giờ",
            "Nguyên tắc Nêu gương ('Một tấm gương sống có giá trị hơn một trăm bài diễn văn')",
            "Nguyên tắc đoàn kết quốc tế",
            "Nguyên tắc học tập suốt đời"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Muốn thuyết phục người khác làm theo điều tốt thì bản thân người lãnh đạo, quản lý phải gương mẫu đi đầu làm trước. Không thể 'nói một đằng làm một nẻo'.",
        "sourceTag": "Vận dụng Nguyên tắc Nêu gương"
    },
    {
        "id": "REAL_022",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Khi tham gia các diễn đàn thảo luận nhóm trực tuyến, một số tài khoản thường sử dụng tính năng ẩn danh để xúc phạm ngoại hình, tung tin đồn vô căn cứ về các bạn học khác.",
        "question": "Hành vi bạo lực mạng này phản ánh điều gì theo quan điểm đạo đức Hồ Chí Minh?",
        "options": [
            "Sự thiếu vắng tình thương yêu con người và sự hèn nhát, vô trách nhiệm trong nếp sống",
            "Là biểu hiện của sự sáng tạo hài hước",
            "Là quyền tự do ngôn luận hợp pháp",
            "Giúp người khác rèn luyện tâm lý vững vàng"
        ],
        "correctAnswer": 0,
        "points": 100,
        "explanation": "Đạo đức Hồ Chí Minh luôn đặt lòng nhân ái, sự tôn trọng nhân phẩm con người lên hàng đầu. Ẩn danh để làm tổn thương người khác là hành vi đi ngược lại đạo đức văn minh.",
        "sourceTag": "Vận dụng Đạo đức trên không gian mạng"
    },
    {
        "id": "REAL_023",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Một nhóm bạn trẻ phát triển một dự án khởi nghiệp cộng đồng nhằm số hóa và dịch các câu chuyện cổ tích Việt Nam ra các thứ tiếng trên thế giới để quảng bá văn hóa dân tộc. Dự án gặp nhiều khó khăn về tài chính giai đoạn đầu.",
        "question": "Dự án này thể hiện đúng nhất tinh thần nào trong tư tưởng văn hóa Hồ Chí Minh?",
        "options": [
            "Văn hóa là hoạt động kinh doanh kiếm lời nhanh nhất",
            "Văn hóa là động lực phát triển, lan tỏa giá trị tốt đẹp của dân tộc ra thế giới bằng công nghệ hiện đại và ý chí tự lực tự cường",
            "Chỉ nên làm việc gì có lãi ngay, không nên làm văn hóa",
            "Văn hóa cổ tích đã lỗi thời không còn giá trị"
        ],
        "correctAnswer": 1,
        "points": 300,
        "explanation": "Đây là hành động thiết thực đưa văn hóa Việt Nam ra thế giới, biến văn hóa thành sức mạnh mềm của dân tộc theo đúng định hướng mở rộng giao lưu văn hóa của Bác.",
        "sourceTag": "Vận dụng Quảng bá văn hóa dân tộc"
    },
    {
        "id": "REAL_024",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Khi tham gia kỳ thi chứng chỉ ngoại ngữ, có người rủ bạn mua thiết bị tai nghe siêu nhỏ để gian lận với giá vài triệu đồng, cam kết 'đỗ 100% không cần học'.",
        "question": "Theo lời Bác dạy về 'Thực học - Thực nghiệp', bạn nên ứng xử ra sao?",
        "options": [
            "Vay tiền mua ngay để có chứng chỉ sớm đi xin việc",
            "Kiên quyết cự tuyệt hành vi gian lận, báo cáo cơ quan chức năng và tập trung ôn luyện bằng chính thực lực của mình",
            "Mua rồi cho bạn bè thuê lại kiếm lời",
            "Học thuộc cách sử dụng thiết bị gian lận"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác luôn dạy: Học để lấy kiến thức thật, năng lực thật để làm việc chứ không phải học giả lấy bằng thật để lừa dối xã hội.",
        "sourceTag": "Vận dụng Thực học - Thực tài"
    },
    {
        "id": "REAL_025",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "EASY",
        "scenarioText": "Một bạn sinh viên sống xa nhà, gia đình gửi tiền sinh hoạt phí hàng tháng nhưng bạn thường dùng hết vào mua sắm quần áo hàng hiệu đắt tiền để bằng bạn bằng bè, dẫn đến cuối tháng phải vay nợ lãi cao.",
        "question": "Bài học về chữ 'KIỆM' của Bác giúp bạn nhận ra sai lầm nào?",
        "options": [
            "Cần vay thêm nhiều khoản khác để trả nợ cũ",
            "Mắc bệnh phô trương hình thức, tiêu xài hoang phí quá khả năng kinh tế, chưa biết quý trọng mồ hôi nước mắt của cha mẹ",
            "Chỉ cần đổi sang mua đồ hiệu vào các đợt giảm giá",
            "Yêu cầu cha mẹ bán đất gửi thêm tiền"
        ],
        "correctAnswer": 1,
        "points": 100,
        "explanation": "Bác dạy 'Kiệm' là biết liệu cơm gắp mắm, không xa hoa hoang phí, sống giản dị trong sạch và biết thương xót công sức lao động của người thân.",
        "sourceTag": "Vận dụng Lối sống giản dị, tiết kiệm"
    },
    {
        "id": "REAL_026",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Tại công ty nơi bạn đang thực tập, bạn phát hiện có một nhân viên thường xuyên bỏ chất thải độc hại trực tiếp ra cống thoát nước chung của khu dân cư vào ban đêm để tiết kiệm chi phí xử lý.",
        "question": "Trách nhiệm công dân và đạo đức xã hội theo tư tưởng Hồ Chí Minh đòi hỏi bạn phải làm gì?",
        "options": [
            "Làm ngơ coi như không thấy vì mình chỉ là thực tập sinh",
            "Báo cáo ngay cho ban lãnh đạo công ty và cơ quan môi trường có thẩm quyền để ngăn chặn hành vi hủy hoại môi trường sống của nhân dân",
            "Đòi nhân viên kia chia tiền tiết kiệm được để giữ im lặng",
            "Học tập cách làm đó để sau này áp dụng cho doanh nghiệp của mình"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác dạy: 'Việc gì hại đến dân ta phải hết sức tránh.' Bảo vệ môi trường sống chính là bảo vệ sức khỏe và tương lai của nhân dân.",
        "sourceTag": "Vận dụng Trách nhiệm bảo vệ môi trường"
    },
    {
        "id": "REAL_027",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "HARD",
        "scenarioText": "Một nhóm bạn trẻ tạo kênh TikTok chia sẻ các video làm từ thiện nhưng thực chất là dàn dựng cảnh người nghèo khóc lóc để kêu gọi quyên góp vào tài khoản cá nhân rồi chiếm đoạt.",
        "question": "Hành vi này đã chà đạp nghiêm trọng lên giá trị đạo đức truyền thống nào mà Bác Hồ dày công vun đắp?",
        "options": [
            "Lòng nhân ái, tình yêu thương con người và sự trung thực trong hoạt động xã hội",
            "Khả năng sáng tạo nội dung số",
            "Kỹ năng diễn xuất trước ống kính",
            "Tự do kinh doanh trên mạng xã hội"
        ],
        "correctAnswer": 0,
        "points": 300,
        "explanation": "Lợi dụng lòng tốt và nỗi khổ của đồng bào để trục lợi cá nhân là hành vi vô đạo đức, phản bội lại truyền thống 'lá lành đùm lá rách' cao đẹp của dân tộc.",
        "sourceTag": "Vận dụng Đạo đức từ thiện & Nhân ái"
    },
    {
        "id": "REAL_028",
        "category": "REAL_LIFE",
        "type": "SCENARIO",
        "difficulty": "MEDIUM",
        "scenarioText": "Trong buổi bầu chọn Ban Chấp hành Đoàn trường, bạn được một ứng viên hứa hẹn sẽ cho đề thi cuối kỳ môn chuyên ngành nếu bạn vận động sinh viên trong khoa bỏ phiếu cho ứng viên đó.",
        "question": "Phẩm chất 'CHÍNH' và danh dự của người đoàn viên theo lời Bác dạy yêu cầu bạn phản ứng thế nào?",
        "options": [
            "Đồng ý ngay vì lợi ích điểm số quá hấp dẫn",
            "Từ chối thẳng thắn, kiên quyết bỏ phiếu dựa trên năng lực và uy tín thực tế của ứng viên, đồng thời báo cáo với Đoàn cấp trên",
            "Nhận lời nhưng sau đó không bầu",
            "Vòi vĩnh thêm tiền mặt"
        ],
        "correctAnswer": 1,
        "points": 200,
        "explanation": "Bác dạy người cán bộ, đoàn viên phải giữ mình trong sạch, chính trực, không bán rẻ lá phiếu và lương tâm vì bất kỳ món lợi ích bất chính nào.",
        "sourceTag": "Vận dụng Chính trực trong công tác Đoàn"
    }
]

# 7. FINAL BATTLE (12 questions - High Stake Bet Questions)
final_questions = [
    {
        "id": "FINAL_001",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Luận điểm 'Văn hóa soi đường cho quốc dân đi' của Hồ Chí Minh (1946) có thể được hiểu toàn diện theo những tầng ý nghĩa triết học và thực tiễn nào?",
        "options": [
            "Chỉ là lời kêu gọi mở rộng các rạp hát và triển lãm tranh sau chiến tranh",
            "Văn hóa định hướng lý tưởng độc lập dân tộc gắn liền CNXH, thức tỉnh ý thức làm chủ, bồi đắp trí tuệ dân tộc và tạo động lực tinh thần vô địch đưa cách mạng đến thắng lợi",
            "Văn hóa chỉ đóng vai trò thứ yếu sau khi các mục tiêu kinh tế kỹ thuật đã hoàn thành",
            "Văn hóa là khuôn mẫu cứng nhắc bắt buộc mọi công dân phải tuân thủ tuyệt đối"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "'Soi đường cho quốc dân đi' thể hiện chức năng dẫn dắt tối cao của văn hóa: soi sáng con đường giải phóng dân tộc, chỉ rõ mục tiêu giải phóng con người, hướng toàn dân tới Chân - Thiện - Mỹ và tạo nên sức mạnh bất diệt của khối đại đoàn kết toàn dân tộc.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 122"
    },
    {
        "id": "FINAL_002",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Tại sao Hồ Chí Minh khẳng định: 'Chủ nghĩa cá nhân là kẻ địch hung ác của chủ nghĩa xã hội. Người cách mạng phải tiêu diệt nó'?",
        "options": [
            "Vì chủ nghĩa cá nhân đặt lợi ích ích kỷ hẹp hòi của bản thân lên trên lợi ích của Tổ quốc và nhân dân, đẻ ra tham ô, lãng phí, chia rẽ khối đoàn kết và làm xói mòn bản chất cách mạng",
            "Vì chủ nghĩa xã hội muốn xóa bỏ hoàn toàn mọi sở thích và quyền lợi chính đáng của cá nhân",
            "Vì chủ nghĩa cá nhân giúp con người làm giàu nhanh hơn tập thể",
            "Vì đó chỉ là một khẩu hiệu mang tính hình thức trong giai đoạn chiến tranh"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Chủ nghĩa cá nhân theo Bác là 'bệnh mẹ', sinh ra trăm thứ bệnh con nguy hiểm như tham ô, lộng quyền, kèn cựa địa vị. Tiêu diệt chủ nghĩa cá nhân không phải thủ tiêu cá tính hay lợi ích chính đáng, mà là ngăn chặn sự tha hóa quyền lực và phản bội nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 135"
    },
    {
        "id": "FINAL_003",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Mối quan hệ bản chất giữa 'Học để làm người' và 'Học để làm cán bộ' trong tư tưởng Hồ Chí Minh phản ánh chân lý sư phạm nào?",
        "options": [
            "Có thể làm cán bộ tốt mà không cần học làm người tử tế",
            "Đạo đức làm người là cái gốc nền tảng; nếu không biết làm người chân chính thì khi nắm quyền lực chỉ trở thành kẻ tha hóa, làm hại nhân dân và đất nước",
            "Chỉ cần học làm cán bộ là đương nhiên tự khắc thành người tốt",
            "Hai mục tiêu này hoàn toàn tách rời nhau trong các cấp học"
        ],
        "correctAnswer": 1,
        "points": 500,
        "explanation": "Bác luôn dạy: Trước khi làm cán bộ phải học làm người. Làm người là có lòng nhân nghĩa, trung thực, liêm khiết và thương yêu đồng bào. Cái gốc 'làm người' vững thì cái tài 'làm cán bộ' mới phục vụ đắc lực cho nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124"
    },
    {
        "id": "FINAL_004",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Trong chiến lược 'Trồng người', Hồ Chí Minh chỉ ra sự kết hợp hữu cơ giữa 'Đức' và 'Tài' như thế nào?",
        "options": [
            "Đức là gốc nhưng phải có Tài để biến lý tưởng thành hiện thực; có Đức mà không có Tài thì vô dụng, có Tài mà không có Đức thì làm hại xã hội",
            "Chỉ cần chú trọng Tài năng, Đức sẽ tự hình thành sau khi giàu có",
            "Chỉ cần có Đức hiền lành, không cần học tập tri thức chuyên môn phức tạp",
            "Tài và Đức loại trừ nhau, người giỏi giang thường không cần đạo đức"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Luận điểm bất hủ của Bác: 'Có tài mà không có đức là người vô dụng. Có đức mà không có tài thì làm việc gì cũng khó.' Đức là gốc định hướng cho Tài phát triển đúng đắn vì lợi ích của nhân dân.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 127"
    },
    {
        "id": "FINAL_005",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Tính chất 'Dân tộc, Khoa học, Đại chúng' của nền văn hóa mới theo tư tưởng Hồ Chí Minh có sự kế thừa và phát triển sáng tạo như thế nào trong bối cảnh toàn cầu hóa hiện nay?",
        "options": [
            "Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc; tiếp thu tinh hoa nhân loại nhưng kiên quyết bảo vệ độc lập tự chủ và cốt cách văn hóa Việt",
            "Đóng cửa hoàn toàn để bảo vệ các hủ tục cổ truyền nguyên vẹn",
            "Bắt chước mọi trào lưu văn hóa ngoại lai không chọn lọc",
            "Xem văn hóa chỉ là sản phẩm tiêu dùng kinh tế thuần túy"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Đảng ta kế thừa trọn vẹn tư tưởng Bác để xác định: Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc, thống nhất trong đa dạng của cộng đồng các dân tộc Việt Nam.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 124-126"
    },
    {
        "id": "FINAL_006",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Luận điểm 'Cần, Kiệm, Liêm, Chính' của Hồ Chí Minh được so sánh với quy luật tự nhiên vĩ đại nào?",
        "options": [
            "Trời có bốn mùa: Xuân, Hạ, Thu, Đông / Đất có bốn phương: Đông, Tây, Nam, Bắc / Người có bốn đức: Cần, Kiệm, Liêm, Chính (Thiếu một mùa thì không thành trời, thiếu một phương thì không thành đất, thiếu một đức thì không thành người)",
            "Như bốn chân của một chiếc bàn",
            "Như bốn bánh xe của cỗ xe kéo",
            "Như bốn bức tường của ngôi nhà gạch"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Trong tác phẩm Cần kiệm liêm chính (1949), Bác nâng tứ đức thành quy luật tất yếu của nhân cách con người, đối sánh với bốn mùa của vũ trụ và bốn phương của đất trời.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 129"
    },
    {
        "id": "FINAL_007",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Tại sao trong xây dựng đạo đức mới, Bác Hồ đặc biệt nhấn mạnh nguyên tắc 'Tu dưỡng đạo đức suốt đời'?",
        "options": [
            "Vì con người hôm nay tốt chưa chắc ngày mai không tha hóa nếu không thường xuyên cảnh giác, tự rèn luyện trước cám dỗ tiền tài, danh vọng và quyền lực",
            "Vì đạo đức là thứ bẩm sinh sinh ra đã có sẵn không thay đổi",
            "Vì chỉ người già mới cần rèn luyện đạo đức",
            "Vì việc tu dưỡng chỉ để chuẩn bị cho việc xét kết nạp Đảng"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Bác dạy: 'Một dân tộc, một đảng và mỗi con người, ngày hôm qua là vĩ đại... không nhất định hôm nay và ngày mai vẫn được mọi người yêu chuộng và ca tụng, nếu lòng dạ không trong sáng nữa, nếu sa vào chủ nghĩa cá nhân.'",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 136"
    },
    {
        "id": "FINAL_008",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Khẳng định 'Dân chủ là của quý báu nhất của nhân dân' của Bác Hồ có mối liên hệ cốt lõi gì với việc xây dựng văn hóa chính trị hiện nay?",
        "options": [
            "Quyền lực thuộc về nhân dân; Nhà nước là công bộc phục vụ nhân dân, bảo đảm dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng",
            "Dân chủ chỉ là khẩu hiệu tuyên truyền đối ngoại",
            "Nhân dân phó thác toàn bộ quyền quyết định cho quan chức mà không cần tham gia giám sát",
            "Dân chủ đồng nghĩa với việc tự do vô chính phủ không cần pháp luật"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Văn hóa chính trị Hồ Chí Minh lấy gốc rễ từ quyền làm chủ thực sự của nhân dân: cán bộ là đày tớ trung thành của dân, tôn trọng và bảo vệ quyền con người.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương IV & VI"
    },
    {
        "id": "FINAL_009",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Hồ Chí Minh vận dụng sáng tạo chủ nghĩa Mác - Lênin vào thực tiễn Việt Nam như thế nào để khẳng định con người vừa là mục tiêu, vừa là động lực?",
        "options": [
            "Không coi con người là lực lượng sản xuất cơ bắp thuần túy, mà coi nhân dân lao động là chủ thể sáng tạo ra lịch sử, có lòng yêu nước nồng nàn và ý chí quật cường",
            "Tuyệt đối hóa yếu tố vũ khí trang bị kỹ thuật",
            "Chỉ coi giai cấp tư sản mới có vai trò động lực",
            "Cho rằng chỉ có viện trợ nước ngoài mới quyết định vận mệnh dân tộc"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Hồ Chí Minh nhận thức sâu sắc rằng sức mạnh to lớn nhất của cách mạng Việt Nam nằm ở lòng yêu nước, ý chí độc lập tự do và sự giác ngộ chính trị của hàng chục triệu người dân lao động.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 138"
    },
    {
        "id": "FINAL_010",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Ý nghĩa lịch sử sâu sắc nhất trong tư tưởng Hồ Chí Minh để lại cho thế hệ trẻ Việt Nam thế kỷ XXI là gì?",
        "options": [
            "Con đường độc lập dân tộc gắn liền với CNXH; ngọn cờ nhân văn lấy dân làm gốc, khát vọng phát triển đất nước phồn vinh, hạnh phúc và tinh thần không ngừng tự vươn lên",
            "Những bài học chỉ phù hợp với thời kỳ phong kiến và chiến tranh trước đây",
            "Chỉ là các kỹ năng đối thoại ngoại giao đơn thuần",
            "Lời nhắc nhở chỉ cần chăm lo đời sống cá nhân riêng lẻ"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Di sản tư tưởng Hồ Chí Minh là ngọn đuốc soi đường: giữ vững bản lĩnh độc lập tự chủ, khơi dậy khát vọng phát triển đất nước phồn vinh, hạnh phúc, sánh vai với các cường quốc năm châu.",
        "sourceTag": "Giáo trình Tư tưởng Hồ Chí Minh (2021), Chương VI, tr. 145"
    },
    {
        "id": "FINAL_011",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Phương châm 'Dĩ bất biến, ứng vạn biến' của Hồ Chí Minh có thể vận dụng vào việc học tập và rèn luyện của sinh viên như thế nào?",
        "options": [
            "Cái 'bất biến' là lý tưởng, đạo đức, mục tiêu sống chân chính; cái 'vạn biến' là linh hoạt, sáng tạo trong phương pháp học tập, nắm bắt công nghệ mới để thích ứng với thời đại",
            "Bất biến là không bao giờ thay đổi thói quen dù sai lầm",
            "Vạn biến là thay đổi mục tiêu sống liên tục theo lợi ích trước mắt",
            "Không cần có bất kỳ nguyên tắc sống nào"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Cái bất biến là lương tâm, lòng yêu nước, khát vọng cống hiến; cái vạn biến là sự nhạy bén, làm chủ chuyển đổi số, thích ứng với thị trường lao động toàn cầu.",
        "sourceTag": "Vận dụng Phương pháp luận Hồ Chí Minh"
    },
    {
        "id": "FINAL_012",
        "category": "FINAL",
        "type": "BET_QUESTION",
        "difficulty": "BOSS",
        "question": "Để trở thành 'Công dân tốt' (A Good Citizen) theo trọn vẹn tinh thần HCM202, mỗi sinh viên cần hội tụ đầy đủ những năng lực cốt lõi nào?",
        "options": [
            "Bản lĩnh tư tưởng vững vàng, đạo đức liêm chính, tri thức chuyên môn sâu rộng, năng lực sáng tạo thực tiễn và tinh thần phụng sự Tổ quốc, nhân dân",
            "Chỉ cần điểm tổng kết học tập GPA cao trên 3.6",
            "Chỉ cần tích cực bình luận các vấn đề thời sự trên mạng",
            "Chỉ cần chấp hành mệnh lệnh một cách thụ động"
        ],
        "correctAnswer": 0,
        "points": 500,
        "explanation": "Hành trình trở thành người công dân tốt là hành trình: Học để hiểu (Learn) -> Tư duy độc lập (Think) -> Dấn thân hành động (Practice) -> Trưởng thành toàn diện (Grow) vì một Việt Nam hùng cường.",
        "sourceTag": "Tổng kết môn học HCM202: The Journey of a Good Citizen"
    }
]

datasets = {
    "culture.json": culture_questions,
    "ethics.json": ethics_questions,
    "human.json": human_questions,
    "education.json": education_questions,
    "practice.json": practice_questions,
    "real-life.json": real_life_questions,
    "final.json": final_questions
}

total_count = 0
for filename, q_list in datasets.items():
    file_path = os.path.join(questions_dir, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(q_list, f, ensure_ascii=False, indent=2)
    print(f"Generated {filename}: {len(q_list)} questions")
    total_count += len(q_list)

print(f"\nTOTAL QUESTIONS GENERATED: {total_count}")
