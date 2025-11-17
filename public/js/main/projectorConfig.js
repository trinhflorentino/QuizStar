const defaultTemplates = {
    'classic': {
      'name': "Cổ điển",
      'description': "Thiết kế truyền thống với màu xanh navy tinh tế",
      'config': {
        'background': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'competitionTitleText': "#ffffff",
        'startQuestionContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'startPlayerContainer': "linear-gradient(135deg, #2563eb, #1d4ed8)",
        'startPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstacleTextContainer': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'obstacleQuestionContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'obstacleOverlay': "rgba(44, 90, 160, 1)",
        'obstacleCenterOverlay': "rgba(30, 58, 138, 1)",
        'obstacleAnswerCenterLine': "#2c5aa0",
        'obstacleAnswerPlayerNameContainer': "linear-gradient(135deg, #2563eb, #1d4ed8)",
        'obstacleAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstaclePlayerSolveContainer': "linear-gradient(135deg, #059669, #10b981)",
        'accelerationQuestionContainer': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'accelerationMediaContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'accelerationAnswerCenterLine': "#2c5aa0",
        'accelerationAnswerPlayerNameContainer': "linear-gradient(135deg, #2563eb, #1d4ed8)",
        'accelerationAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishQuestionPackContainer': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'finishQuestionContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'finishPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'finishSideInfoContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'additionalQuestionContainer': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'additionalPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'additionalSideInfoContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'pointSummaryPlayerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'scoreboardPlayerNameContainer': "linear-gradient(135deg, #2c5aa0, #1e3a8a)",
        'scoreboardPlayerNameText': "#ffffff",
        'scoreboardPlayerPointContainer': "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        'scoreboardPlayerPointText': "#ffffff"
      }
    },
    'modern': {
      'name': "Hiện đại",
      'description': "Giao diện hiện đại với màu tím bắt mắt",
      'config': {
        'background': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'competitionTitleText': "#ffffff",
        'startQuestionContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'startPlayerContainer': "linear-gradient(135deg, #7c3aed, #6d28d9)",
        'startPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstacleTextContainer': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'obstacleQuestionContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'obstacleOverlay': "rgba(124, 58, 237, 1)",
        'obstacleCenterOverlay': "rgba(76, 29, 149, 1)",
        'obstacleAnswerCenterLine': "#7c3aed",
        'obstacleAnswerPlayerNameContainer': "linear-gradient(135deg, #7c3aed, #6d28d9)",
        'obstacleAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstaclePlayerSolveContainer': "linear-gradient(135deg, #059669, #10b981)",
        'accelerationQuestionContainer': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'accelerationMediaContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'accelerationAnswerCenterLine': "#7c3aed",
        'accelerationAnswerPlayerNameContainer': "linear-gradient(135deg, #7c3aed, #6d28d9)",
        'accelerationAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishQuestionPackContainer': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'finishQuestionContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'finishPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'finishSideInfoContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'additionalQuestionContainer': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'additionalPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'additionalSideInfoContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'pointSummaryPlayerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'scoreboardPlayerNameContainer': "linear-gradient(135deg, #7c3aed, #4c1d95)",
        'scoreboardPlayerNameText': "#ffffff",
        'scoreboardPlayerPointContainer': "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        'scoreboardPlayerPointText': '#ffffff'
      }
    },
    'nature': {
      'name': "Thiên nhiên",
      'description': "Màu xanh lá êm dịu, hài hòa với thiên nhiên",
      'config': {
        'background': "linear-gradient(135deg, #047857, #065f46)",
        'competitionTitleText': "#ffffff",
        'startQuestionContainer': "linear-gradient(135deg, #059669, #10b981)",
        'startPlayerContainer': "linear-gradient(135deg, #047857, #10b981)",
        'startPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstacleTextContainer': "linear-gradient(135deg, #047857, #065f46)",
        'obstacleQuestionContainer': "linear-gradient(135deg, #059669, #10b981)",
        'obstacleOverlay': "rgba(4, 120, 87, 1)",
        'obstacleCenterOverlay': "rgba(6, 95, 70, 1)",
        'obstacleAnswerCenterLine': '#047857',
        'obstacleAnswerPlayerNameContainer': "linear-gradient(135deg, #047857, #10b981)",
        'obstacleAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'obstaclePlayerSolveContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'accelerationQuestionContainer': "linear-gradient(135deg, #047857, #065f46)",
        'accelerationMediaContainer': "linear-gradient(135deg, #059669, #10b981)",
        'accelerationAnswerCenterLine': "#047857",
        'accelerationAnswerPlayerNameContainer': "linear-gradient(135deg, #047857, #10b981)",
        'accelerationAnswerPlayerAnswerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishQuestionPackContainer': "linear-gradient(135deg, #047857, #065f46)",
        'finishQuestionContainer': "linear-gradient(135deg, #059669, #10b981)",
        'finishPlayerHighlightContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'finishPlayerBuzzerContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'finishSideInfoContainer': "linear-gradient(135deg, #059669, #10b981)",
        'additionalQuestionContainer': "linear-gradient(135deg, #047857, #065f46)",
        'additionalPlayerBuzzerContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'additionalSideInfoContainer': "linear-gradient(135deg, #059669, #10b981)",
        'pointSummaryPlayerContainer': "linear-gradient(135deg, #f59e0b, #d97706)",
        'scoreboardPlayerNameContainer': "linear-gradient(135deg, #047857, #065f46)",
        'scoreboardPlayerNameText': "#ffffff",
        'scoreboardPlayerPointContainer': "linear-gradient(135deg, #059669, #10b981)",
        'scoreboardPlayerPointText': "#ffffff"
      }
    },
    'sunset': {
      'name': "Hoàng hôn",
      'description': "Màu cam burgundy ấm áp, không chói mắt",
      'config': {
        'background': "linear-gradient(135deg, #c2410c, #9a3412)",
        'competitionTitleText': "#ffffff",
        'startQuestionContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'startPlayerContainer': "linear-gradient(135deg, #c2410c, #dc2626)",
        'startPlayerHighlightContainer': "linear-gradient(135deg, #fbbf24, #f59e0b)",
        'obstacleTextContainer': "linear-gradient(135deg, #c2410c, #9a3412)",
        'obstacleQuestionContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'obstacleOverlay': "rgba(194, 65, 12, 1)",
        'obstacleCenterOverlay': "rgba(154, 52, 18, 1)",
        'obstacleAnswerCenterLine': "#c2410c",
        'obstacleAnswerPlayerNameContainer': "linear-gradient(135deg, #c2410c, #dc2626)",
        'obstacleAnswerPlayerAnswerContainer': "linear-gradient(135deg, #fbbf24, #f59e0b)",
        'obstaclePlayerSolveContainer': "linear-gradient(135deg, #059669, #10b981)",
        'accelerationQuestionContainer': "linear-gradient(135deg, #c2410c, #9a3412)",
        'accelerationMediaContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'accelerationAnswerCenterLine': '#c2410c',
        'accelerationAnswerPlayerNameContainer': "linear-gradient(135deg, #c2410c, #dc2626)",
        'accelerationAnswerPlayerAnswerContainer': "linear-gradient(135deg, #fbbf24, #f59e0b)",
        'finishQuestionPackContainer': "linear-gradient(135deg, #c2410c, #9a3412)",
        'finishQuestionContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'finishPlayerHighlightContainer': "linear-gradient(135deg, #fbbf24, #f59e0b)",
        'finishPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'finishSideInfoContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'additionalQuestionContainer': "linear-gradient(135deg, #c2410c, #9a3412)",
        'additionalPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'additionalSideInfoContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'pointSummaryPlayerContainer': "linear-gradient(135deg, #fbbf24, #f59e0b)",
        'scoreboardPlayerNameContainer': "linear-gradient(135deg, #c2410c, #9a3412)",
        'scoreboardPlayerNameText': "#ffffff",
        'scoreboardPlayerPointContainer': "linear-gradient(135deg, #ea580c, #dc2626)",
        'scoreboardPlayerPointText': "#ffffff"
      }
    },
    'dark': {
      'name': "Tối tăm",
      'description': "Giao diện tối với màu xám xanh",
      'config': {
        'background': "linear-gradient(135deg, #1e293b, #0f172a)",
        'competitionTitleText': "#f1f5f9",
        'startQuestionContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'startPlayerContainer': "linear-gradient(135deg, #1e293b, #334155)",
        'startPlayerHighlightContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'obstacleTextContainer': "linear-gradient(135deg, #1e293b, #0f172a)",
        'obstacleQuestionContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'obstacleOverlay': "rgba(30, 41, 59, 1)",
        'obstacleCenterOverlay': "rgba(15, 23, 42, 1)",
        'obstacleAnswerCenterLine': "#1e293b",
        'obstacleAnswerPlayerNameContainer': "linear-gradient(135deg, #1e293b, #334155)",
        'obstacleAnswerPlayerAnswerContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'obstaclePlayerSolveContainer': "linear-gradient(135deg, #059669, #10b981)",
        'accelerationQuestionContainer': "linear-gradient(135deg, #1e293b, #0f172a)",
        'accelerationMediaContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'accelerationAnswerCenterLine': "#1e293b",
        'accelerationAnswerPlayerNameContainer': "linear-gradient(135deg, #1e293b, #334155)",
        'accelerationAnswerPlayerAnswerContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'finishQuestionPackContainer': "linear-gradient(135deg, #1e293b, #0f172a)",
        'finishQuestionContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'finishPlayerHighlightContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'finishPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'finishSideInfoContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'additionalQuestionContainer': "linear-gradient(135deg, #1e293b, #0f172a)",
        'additionalPlayerBuzzerContainer': "linear-gradient(135deg, #059669, #10b981)",
        'additionalSideInfoContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'pointSummaryPlayerContainer': "linear-gradient(135deg, #0891b2, #0e7490)",
        'scoreboardPlayerNameContainer': "linear-gradient(135deg, #1e293b, #0f172a)",
        'scoreboardPlayerNameText': '#f1f5f9',
        'scoreboardPlayerPointContainer': "linear-gradient(135deg, #334155, #1e293b)",
        'scoreboardPlayerPointText': "#f1f5f9"
      }
    }
  };
  let configTemplates = {
    ...defaultTemplates
  };
  let allFirestoreThemes = [];
  async function fetchThemesFromFirestore() {
    try {
      const _0x46e0f4 = await firebase.firestore().collection('projectorConfigThemes').orderBy("createdAt", "desc").get();
      const _0x4a73ff = {};
      allFirestoreThemes = [];
      _0x46e0f4.forEach(_0x2f2a48 => {
        const _0x1d97bd = _0x2f2a48.data();
        if (_0x1d97bd.active === false || _0x1d97bd.isActive === false) {
          return;
        }
        const _0x3e1388 = {
          'id': _0x2f2a48.id,
          'name': _0x1d97bd.name,
          'description': _0x1d97bd.description,
          'config': _0x1d97bd.config,
          'author': _0x1d97bd.author || "Unknown",
          'createdAt': _0x1d97bd.createdAt,
          'downloads': _0x1d97bd.downloads || 0x0,
          'previewImageUrl': _0x1d97bd.previewImageUrl || null,
          'isFirestore': true
        };
        _0x4a73ff[_0x2f2a48.id] = _0x3e1388;
        allFirestoreThemes.push(_0x3e1388);
      });
      configTemplates = {
        ...defaultTemplates,
        ..._0x4a73ff
      };
      console.log("Total documents in Firestore: " + _0x46e0f4.size);
      console.log("Active themes loaded: " + Object.keys(_0x4a73ff).length);
      console.log("Firestore themes:", _0x4a73ff);
      return _0x4a73ff;
    } catch (_0x52ed5f) {
      console.error("Error fetching themes from Firestore:", _0x52ed5f);
      return {};
    }
  }
  async function incrementThemeDownloads(_0x7022b9) {
    if (!_0x7022b9 || !configTemplates[_0x7022b9]?.["isFirestore"]) {
      return;
    }
    try {
      await firebase.firestore().collection("projectorConfigThemes").doc(_0x7022b9).update({
        'downloads': firebase.firestore.FieldValue.increment(0x1)
      });
    } catch (_0x599f2f) {
      console.error("Error incrementing theme downloads:", _0x599f2f);
    }
  }
  const configGroups = {
    "Thuộc tính chung": {
      'background': "Nền giao diện máy chiếu",
      'competitionTitleText': "Màu chữ tiêu đề phần thi và điểm số thí sinh"
    },
    "Khởi động": {
      'startQuestionContainer': "Nền giao diện câu hỏi",
      'startPlayerContainer': "Nền ô thí sinh",
      'startPlayerHighlightContainer': "Nền ô thí sinh được chọn/ấn chuông"
    },
    "Vượt chướng ngại vật": {
      'obstacleTextContainer': "Nền ô số lượng chướng ngại vật",
      'obstacleQuestionContainer': "Nền câu hỏi chướng ngại vật",
      'obstacleOverlay': "Màu nền ô hình ảnh chướng ngại vật",
      'obstacleCenterOverlay': "Màu nền ô trung tâm hình ảnh chướng ngại vật",
      'obstacleAnswerCenterLine': "Màu thanh giữa ở câu trả lời",
      'obstacleAnswerPlayerNameContainer': "Nền tên thí sinh ở câu trả lời",
      'obstacleAnswerPlayerAnswerContainer': "Nền câu trả lời thí sinh",
      'obstaclePlayerSolveContainer': "Màu nền thí sinh giành quyền trả lời chướng ngại vật"
    },
    "Tăng tốc": {
      'accelerationQuestionContainer': "Màu nền câu hỏi tăng tốc",
      'accelerationMediaContainer': "Màu nền phương tiện tăng tốc",
      'accelerationAnswerCenterLine': "Màu thanh bên trái ở câu trả lời",
      'accelerationAnswerPlayerNameContainer': "Nền tên thí sinh ở câu trả lời",
      'accelerationAnswerPlayerAnswerContainer': "Nền câu trả lời thí sinh"
    },
    "Về đích": {
      'finishQuestionPackContainer': "Màu nền ô gói câu hỏi",
      'finishQuestionContainer': "Màu nền câu hỏi về đích",
      'finishPlayerHighlightContainer': "Nền ô thí sinh được chọn",
      'finishPlayerBuzzerContainer': "Nền thí sinh ấn chuông",
      'finishSideInfoContainer': "Nền thông tin bên phải về đích"
    },
    "Câu hỏi phụ": {
      'additionalQuestionContainer': "Màu nền câu hỏi câu hỏi phụ",
      'additionalPlayerBuzzerContainer': "Nền thí sinh ấn chuông",
      'additionalSideInfoContainer': "Nền thông tin bên phải câu hỏi phụ"
    },
    "Tổng kết điểm": {
      'pointSummaryPlayerContainer': "Nền các thông tin tổng kết điểm"
    },
    "Bảng điểm số": {
      'scoreboardPlayerNameContainer': "Nền tên thí sinh",
      'scoreboardPlayerNameText': "Màu chữ tên thí sinh",
      'scoreboardPlayerPointContainer': "Nền điểm thí sinh",
      'scoreboardPlayerPointText': "Màu chữ điểm thí sinh"
    }
  };
  function createTemplatesSection(_0x39904c) {
    const _0x217dcf = document.createElement("div");
    _0x217dcf.classList.add('mb-8', "p-6", "bg-gradient-to-r", 'from-blue-50', "to-indigo-50", 'dark:from-gray-800', "dark:to-gray-900", "rounded-xl", "border", "border-blue-200", 'dark:border-gray-700');
    const _0x13bca7 = document.createElement('div');
    _0x13bca7.classList.add("mb-4");
    const _0x467d7c = document.createElement('h2');
    _0x467d7c.innerHTML = "\n        <span style=\"font-size: 24px;\">🎨</span>\n        <span class=\"ml-2 text-xl font-bold text-gray-800 dark:text-white\">Giao diện mẫu</span>\n        <span class=\"ml-2 text-sm text-gray-600 dark:text-gray-400\">Áp dụng ngay với 1 click</span>\n    ";
    _0x467d7c.classList.add("flex", "items-center");
    _0x13bca7.appendChild(_0x467d7c);
    _0x217dcf.appendChild(_0x13bca7);
    const _0x1da018 = document.createElement("div");
    _0x1da018.classList.add("grid", 'grid-cols-1', "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-5", "gap-4");
    _0x1da018.id = "templatesGrid";
    const _0x36e8ff = Object.entries(configTemplates);
    const _0x3466cd = _0x36e8ff.slice(0x0, 0x8);
    _0x3466cd.forEach(([_0x3404b3, _0x5477c4]) => {
      const _0x2a46d0 = document.createElement("div");
      _0x2a46d0.classList.add('relative', "group", 'cursor-pointer', "transform", 'transition-all', "duration-300", "hover:scale-105", "hover:shadow-xl", "rounded-lg", "overflow-hidden");
      _0x2a46d0.dataset.template = _0x3404b3;
      const _0x2524be = document.createElement('div');
      _0x2524be.classList.add("relative", "h-32", "rounded-lg", "overflow-hidden", "border-2", "border-gray-300", "dark:border-gray-600", 'group-hover:border-blue-400', 'dark:group-hover:border-blue-500');
      const _0x1957c3 = document.createElement('div');
      const _0x2fd599 = getTemplateBackgroundStyle(_0x5477c4.config.background, _0x5477c4.previewImageUrl);
      _0x1957c3.style.cssText = "\n            width: 100%;\n            height: 100%;\n            " + _0x2fd599 + "\n            position: relative;\n        ";
      const _0x33b248 = document.createElement("div");
      _0x33b248.innerHTML = "\n            <div style=\"position: absolute; top: 8px; left: 8px; right: 8px; height: 12px; background: " + _0x5477c4.config.startQuestionContainer + "; border-radius: 4px; opacity: 0.9;\"></div>\n            <div style=\"position: absolute; top: 25px; left: 8px; width: 30%; height: 8px; background: " + _0x5477c4.config.startPlayerContainer + "; border-radius: 2px; opacity: 0.8;\"></div>\n            <div style=\"position: absolute; top: 25px; right: 8px; width: 30%; height: 8px; background: " + _0x5477c4.config.startPlayerHighlightContainer + "; border-radius: 2px; opacity: 0.8;\"></div>\n            <div style=\"position: absolute; bottom: 20px; left: 8px; right: 8px; height: 20px; background: " + _0x5477c4.config.obstacleQuestionContainer + "; border-radius: 4px; opacity: 0.9;\"></div>\n            <div style=\"position: absolute; bottom: 8px; left: 8px; width: 40%; height: 8px; background: " + _0x5477c4.config.finishPlayerBuzzerContainer + "; border-radius: 2px; opacity: 0.8;\"></div>\n            <div style=\"position: absolute; bottom: 8px; right: 8px; width: 40%; height: 8px; background: " + _0x5477c4.config.additionalPlayerBuzzerContainer + "; border-radius: 2px; opacity: 0.8;\"></div>\n        ";
      _0x1957c3.appendChild(_0x33b248);
      _0x2524be.appendChild(_0x1957c3);
      const _0x306311 = document.createElement('div');
      _0x306311.classList.add('absolute', "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300");
      const _0x2d43a2 = document.createElement("button");
      _0x2d43a2.innerHTML = "\n            <span style=\"font-size: 16px;\">✨</span>\n            <span class=\"ml-1\">Áp dụng</span>\n        ";
      _0x2d43a2.classList.add("px-4", "py-2", "bg-white", "text-gray-800", 'rounded-lg', "font-medium", "transform", "scale-90", "group-hover:scale-100", "transition-transform", "duration-300", "shadow-lg");
      _0x306311.appendChild(_0x2d43a2);
      _0x2524be.appendChild(_0x306311);
      const _0x557581 = document.createElement("div");
      _0x557581.classList.add("mt-3", "text-center");
      const _0x225b26 = document.createElement('h3');
      _0x225b26.textContent = _0x5477c4.name;
      _0x225b26.classList.add("font-semibold", 'text-gray-800', "dark:text-white", 'text-sm');
      const _0x136764 = document.createElement('p');
      _0x136764.textContent = _0x5477c4.description;
      _0x136764.classList.add('text-xs', "text-gray-600", "dark:text-gray-400", "mt-1", "line-clamp-2");
      _0x557581.appendChild(_0x225b26);
      _0x557581.appendChild(_0x136764);
      _0x2a46d0.appendChild(_0x2524be);
      _0x2a46d0.appendChild(_0x557581);
      _0x2a46d0.addEventListener("click", async () => await applyTemplate(_0x3404b3));
      _0x1da018.appendChild(_0x2a46d0);
    });
    if (_0x36e8ff.length > 0x8) {
      const _0x4fa1ec = createExploreMoreCard();
      _0x1da018.appendChild(_0x4fa1ec);
    }
    _0x217dcf.appendChild(_0x1da018);
    _0x39904c.appendChild(_0x217dcf);
  }
  function createExploreMoreCard() {
    const _0x14af20 = document.createElement("div");
    _0x14af20.classList.add("relative", 'group', "cursor-pointer", 'transform', "transition-all", 'duration-300', 'hover:scale-105', "hover:shadow-xl", "rounded-lg", 'overflow-hidden', "border-2", "border-dashed", "border-gray-300", "dark:border-gray-600", "bg-gradient-to-br", "from-gray-50", "to-gray-100", "dark:from-gray-700", "dark:to-gray-800");
    _0x14af20.style.height = '200px';
    _0x14af20.innerHTML = "\n        <div class=\"flex flex-col items-center justify-center h-full p-4 text-center\">\n            <div class=\"text-4xl mb-3 group-hover:scale-110 transition-transform duration-300\">🔍</div>\n            <h3 class=\"font-semibold text-gray-800 dark:text-white text-sm mb-1\">Khám phá thêm</h3>\n            <p class=\"text-xs text-gray-600 dark:text-gray-400 mb-2\">Xem tất cả " + Object.keys(configTemplates).length + " giao diện</p>\n            <div class=\"text-xs text-blue-600 dark:text-blue-400 font-medium\">Click để xem →</div>\n        </div>\n    ";
    _0x14af20.addEventListener("click", openThemeExploreModal);
    return _0x14af20;
  }
  function openThemeExploreModal() {
    const _0x227632 = document.createElement("div");
    _0x227632.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.7);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        z-index: 9999;\n    ";
    const _0x4f36fa = document.createElement('div');
    _0x4f36fa.style.cssText = "\n        background: white;\n        border-radius: 15px;\n        max-width: 1200px;\n        width: 95%;\n        max-height: 90vh;\n        overflow: hidden;\n        box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n        display: flex;\n        flex-direction: column;\n    ";
    _0x4f36fa.innerHTML = "\n        <div style=\"padding: 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;\">\n            <div>\n                <h3 style=\"margin: 0; color: #333; font-size: 24px; display: flex; align-items: center;\">\n                    <span style=\"font-size: 28px; margin-right: 10px;\">🎨</span>\n                    Khám phá giao diện\n                </h3>\n                <p style=\"margin: 5px 0 0 0; color: #666; font-size: 14px;\">Tổng cộng " + Object.keys(configTemplates).length + " giao diện có sẵn</p>\n            </div>\n            <button id=\"closeExplore\" style=\"background: none; border: none; font-size: 28px; cursor: pointer; color: #999; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;\">×</button>\n        </div>\n        \n        <div style=\"flex: 1; overflow-y: auto; padding: 25px;\">\n            <div id=\"exploreGrid\" style=\"display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;\"></div>\n            \n            <div id=\"paginationContainer\" style=\"display: flex; justify-content: center; align-items: center; margin-top: 30px; gap: 10px;\">\n                <!-- Pagination will be inserted here -->\n            </div>\n        </div>\n    ";
    _0x227632.appendChild(_0x4f36fa);
    document.body.appendChild(_0x227632);
    initializeThemeExploration(_0x227632);
    _0x4f36fa.querySelector("#closeExplore").addEventListener('click', () => {
      document.body.removeChild(_0x227632);
    });
    _0x227632.addEventListener("click", _0x1a26c3 => {
      if (_0x1a26c3.target === _0x227632) {
        document.body.removeChild(_0x227632);
      }
    });
  }
  function initializeThemeExploration(_0x20249d) {
    const _0x46aa6a = Object.entries(configTemplates);
    const _0x3a9599 = Math.ceil(_0x46aa6a.length / 0xc);
    function _0x365eb7(_0x3e5362) {
      const _0x158e68 = _0x20249d.querySelector("#exploreGrid");
      const _0x26795f = (_0x3e5362 - 0x1) * 0xc;
      const _0x13ecb4 = _0x26795f + 0xc;
      const _0x47dd62 = _0x46aa6a.slice(_0x26795f, _0x13ecb4);
      _0x158e68.innerHTML = '';
      _0x47dd62.forEach(([_0x2cfdfc, _0xa5e2ae]) => {
        const _0x103158 = createDetailedThemeCard(_0x2cfdfc, _0xa5e2ae);
        _0x158e68.appendChild(_0x103158);
      });
      _0x512ace(_0x3e5362, _0x3a9599);
    }
    function _0x512ace(_0x35d95e, _0x492b34) {
      const _0x22b759 = _0x20249d.querySelector("#paginationContainer");
      _0x22b759.innerHTML = '';
      if (_0x492b34 <= 0x1) {
        return;
      }
      if (_0x35d95e > 0x1) {
        const _0x534627 = _0x8d577b("‹ Trước", () => {
          _0x35d95e--;
          _0x365eb7(_0x35d95e);
        });
        _0x22b759.appendChild(_0x534627);
      }
      const _0x488036 = Math.max(0x1, _0x35d95e - 0x2);
      const _0x1c904b = Math.min(_0x492b34, _0x35d95e + 0x2);
      if (_0x488036 > 0x1) {
        _0x22b759.appendChild(_0x8d577b('1', () => {
          _0x35d95e = 0x1;
          _0x365eb7(_0x35d95e);
        }));
        if (_0x488036 > 0x2) {
          const _0x569f8e = document.createElement("span");
          _0x569f8e.textContent = '...';
          _0x569f8e.style.cssText = "color: #666; padding: 0 5px;";
          _0x22b759.appendChild(_0x569f8e);
        }
      }
      for (let _0x5bb48f = _0x488036; _0x5bb48f <= _0x1c904b; _0x5bb48f++) {
        const _0x557c77 = _0x5bb48f === _0x35d95e;
        const _0x1471be = _0x8d577b(_0x5bb48f.toString(), () => {
          _0x35d95e = _0x5bb48f;
          _0x365eb7(_0x35d95e);
        }, _0x557c77);
        _0x22b759.appendChild(_0x1471be);
      }
      if (_0x1c904b < _0x492b34) {
        if (_0x1c904b < _0x492b34 - 0x1) {
          const _0x47f2ab = document.createElement("span");
          _0x47f2ab.textContent = "...";
          _0x47f2ab.style.cssText = "color: #666; padding: 0 5px;";
          _0x22b759.appendChild(_0x47f2ab);
        }
        _0x22b759.appendChild(_0x8d577b(_0x492b34.toString(), () => {
          _0x35d95e = _0x492b34;
          _0x365eb7(_0x35d95e);
        }));
      }
      if (_0x35d95e < _0x492b34) {
        const _0x5489e1 = _0x8d577b("Tiếp ›", () => {
          _0x35d95e++;
          _0x365eb7(_0x35d95e);
        });
        _0x22b759.appendChild(_0x5489e1);
      }
    }
    function _0x8d577b(_0x54c442, _0x389350, _0x2591ee = false) {
      const _0x3c87bf = document.createElement("button");
      _0x3c87bf.textContent = _0x54c442;
      _0x3c87bf.style.cssText = "\n            padding: 8px 12px;\n            border: 1px solid " + (_0x2591ee ? '#3b82f6' : "#ddd") + ";\n            background: " + (_0x2591ee ? '#3b82f6' : "white") + ";\n            color: " + (_0x2591ee ? "white" : '#333') + ";\n            border-radius: 6px;\n            cursor: pointer;\n            font-size: 14px;\n            transition: all 0.2s;\n        ";
      if (!_0x2591ee) {
        _0x3c87bf.addEventListener("mouseenter", () => {
          _0x3c87bf.style.background = "#f8f9fa";
          _0x3c87bf.style.borderColor = "#3b82f6";
        });
        _0x3c87bf.addEventListener("mouseleave", () => {
          _0x3c87bf.style.background = 'white';
          _0x3c87bf.style.borderColor = "#ddd";
        });
      }
      _0x3c87bf.addEventListener("click", _0x389350);
      return _0x3c87bf;
    }
    _0x365eb7(0x1);
  }
  function createDetailedThemeCard(_0x58366d, _0x1798be) {
    const _0x7356aa = document.createElement("div");
    _0x7356aa.classList.add('relative', 'group', "cursor-pointer", 'transform', 'transition-all', "duration-300", "hover:scale-105", "hover:shadow-xl", 'rounded-lg', "overflow-hidden", "bg-white", "border", "border-gray-200");
    const _0x28dd32 = getTemplateBackgroundStyle(_0x1798be.config.background, _0x1798be.previewImageUrl);
    _0x7356aa.innerHTML = "\n        <div class=\"relative h-32 overflow-hidden\">\n            <div style=\"width: 100%; height: 100%; " + _0x28dd32 + " position: relative;\">\n                <div style=\"position: absolute; top: 6px; left: 6px; right: 6px; height: 8px; background: " + _0x1798be.config.startQuestionContainer + "; border-radius: 2px; opacity: 0.9;\"></div>\n                <div style=\"position: absolute; top: 18px; left: 6px; width: 25%; height: 6px; background: " + _0x1798be.config.startPlayerContainer + "; border-radius: 1px; opacity: 0.8;\"></div>\n                <div style=\"position: absolute; top: 18px; right: 6px; width: 25%; height: 6px; background: " + _0x1798be.config.startPlayerHighlightContainer + "; border-radius: 1px; opacity: 0.8;\"></div>\n                <div style=\"position: absolute; bottom: 15px; left: 6px; right: 6px; height: 12px; background: " + _0x1798be.config.obstacleQuestionContainer + "; border-radius: 2px; opacity: 0.9;\"></div>\n                <div style=\"position: absolute; bottom: 6px; left: 6px; width: 35%; height: 6px; background: " + _0x1798be.config.finishPlayerBuzzerContainer + "; border-radius: 1px; opacity: 0.8;\"></div>\n                <div style=\"position: absolute; bottom: 6px; right: 6px; width: 35%; height: 6px; background: " + _0x1798be.config.additionalPlayerBuzzerContainer + "; border-radius: 1px; opacity: 0.8;\"></div>\n            </div>\n            \n            <div class=\"absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300\">\n                <button class=\"px-4 py-2 bg-white text-gray-800 rounded-lg font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg\">\n                    <span style=\"font-size: 14px;\">✨</span>\n                    <span class=\"ml-1\">Áp dụng</span>\n                </button>\n            </div>\n        </div>\n        \n        <div class=\"p-4\">\n            <div class=\"flex items-start justify-between mb-2\">\n                <h3 class=\"font-semibold text-gray-800 text-sm leading-tight\">" + _0x1798be.name + "</h3>\n                " + (_0x1798be.isFirestore ? "<span class=\"text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2\">Mới</span>" : '') + "\n            </div>\n            <p class=\"text-xs text-gray-600 mb-3 line-clamp-2\">" + _0x1798be.description + "</p>\n            \n            <div class=\"flex items-center justify-between text-xs text-gray-500\">\n                " + (_0x1798be.author ? "<span>👤 " + _0x1798be.author + "</span>" : "<span></span>") + "\n                " + (_0x1798be.downloads ? "<span>⬇️ " + _0x1798be.downloads + "</span>" : '') + "\n            </div>\n        </div>\n    ";
    _0x7356aa.addEventListener("click", async () => {
      await applyTemplate(_0x58366d);
      const _0x513b67 = _0x7356aa.closest("[style*=\"position: fixed\"]");
      if (_0x513b67) {
        document.body.removeChild(_0x513b67);
      }
    });
    return _0x7356aa;
  }
  async function applyTemplate(_0xbe59d5) {
    const _0x450d6c = configTemplates[_0xbe59d5];
    if (!_0x450d6c) {
      return;
    }
    const _0x577b02 = await showCustomConfirm("Bạn có chắc muốn áp dụng giao diện \"" + _0x450d6c.name + "\"?\n\nLưu ý: Thao tác này sẽ ghi đè lên tất cả cấu hình hiện tại.", "Xác nhận áp dụng giao diện", "Áp dụng", "Hủy");
    if (!_0x577b02) {
      return;
    }
    Object.entries(_0x450d6c.config).forEach(([_0x2590ac, _0x4a0c1f]) => {
      const _0x439cb2 = document.getElementById("projectorConfig_" + _0x2590ac);
      if (_0x439cb2) {
        _0x439cb2.value = _0x4a0c1f;
        updatePreview(_0x2590ac);
      }
    });
    incrementThemeDownloads(_0xbe59d5);
    saveConfig();
    if (typeof showToast === "function") {
      showToast("✅ Đã áp dụng giao diện \"" + _0x450d6c.name + "\" và lưu thành công!", "success");
    } else {
      showCustomAlert("Đã áp dụng giao diện \"" + _0x450d6c.name + "\" và lưu thành công!", "Thành công", "success");
    }
    const _0x5524c6 = document.querySelector("#projectorConfigContainer > div:not(:first-child)");
    if (_0x5524c6) {
      _0x5524c6.scrollIntoView({
        'behavior': "smooth",
        'block': 'start'
      });
    }
  }
  function getTemplateBackgroundStyle(_0x54a30b, _0x32529e = null) {
    if (_0x32529e) {
      return "background-image: url(" + _0x32529e + "); background-size: cover; background-position: center; background-repeat: no-repeat;";
    }
    if (!_0x54a30b) {
      return "background: #667eea;";
    }
    return _0x54a30b.startsWith("http") || _0x54a30b.includes('cloudinary.com') || _0x54a30b.startsWith("data:image") ? "background-image: url(" + _0x54a30b + "); background-size: cover; background-position: center; background-repeat: no-repeat;" : "background: " + _0x54a30b + ';';
  }
  function showTemplatePreview() {
    console.log("Show template preview");
  }
  function hideTemplatePreview() {
    console.log("Hide template preview");
  }
  function createSimplifiedControl(_0x1b4456, _0x402a21) {
    const _0x39e17e = document.createElement("div");
    _0x39e17e.classList.add("space-y-3");
    const _0x2014b6 = document.createElement('input');
    _0x2014b6.type = "text";
    _0x2014b6.id = 'projectorConfig_' + _0x1b4456;
    _0x2014b6.placeholder = "Nhập màu, gradient hoặc URL hình ảnh";
    _0x2014b6.classList.add("w-full", "pl-3", "pr-3", 'py-2', "bg-transparent", "border", 'rounded-md', 'text-black', "dark:text-white");
    _0x2014b6.addEventListener("input", () => updatePreview(_0x1b4456));
    _0x2014b6.addEventListener('blur', () => updatePreview(_0x1b4456));
    _0x39e17e.appendChild(_0x2014b6);
    const _0x34d827 = document.createElement("div");
    _0x34d827.classList.add("flex", "space-x-2", "items-center");
    const _0x2fdcc0 = document.createElement("input");
    _0x2fdcc0.type = "color";
    _0x2fdcc0.id = "colorPicker_" + _0x1b4456;
    _0x2fdcc0.classList.add("w-12", 'h-8', 'rounded', "border", "cursor-pointer");
    _0x2fdcc0.title = "Chọn màu";
    _0x2fdcc0.addEventListener("input", () => {
      _0x2014b6.value = _0x2fdcc0.value;
      updatePreview(_0x1b4456);
    });
    const _0xa2879d = document.createElement('button');
    _0xa2879d.type = "button";
    _0xa2879d.innerHTML = "📷 Upload";
    _0xa2879d.classList.add("px-3", "py-1", "text-xs", 'bg-blue-500', "text-white", "rounded", "hover:bg-blue-600");
    _0xa2879d.addEventListener('click', () => openImageUpload(_0x1b4456));
    const _0x474c64 = document.createElement('button');
    _0x474c64.type = "button";
    _0x474c64.innerHTML = "🗑️ Xóa";
    _0x474c64.classList.add('px-3', "py-1", "text-xs", "bg-red-500", 'text-white', "rounded", "hover:bg-red-600");
    _0x474c64.id = "deleteBtn_" + _0x1b4456;
    _0x474c64.style.display = "none";
    _0x474c64.addEventListener("click", () => deleteImage(_0x1b4456));
    const _0x40c00c = document.createElement("button");
    _0x40c00c.type = 'button';
    _0x40c00c.innerHTML = "🌈 Gradient";
    _0x40c00c.classList.add("px-3", "py-1", "text-xs", "bg-purple-500", "text-white", "rounded", "hover:bg-purple-600");
    _0x40c00c.addEventListener("click", () => openGradientHelper(_0x1b4456));
    _0x34d827.appendChild(_0x2fdcc0);
    _0x34d827.appendChild(_0xa2879d);
    _0x34d827.appendChild(_0x474c64);
    _0x34d827.appendChild(_0x40c00c);
    _0x39e17e.appendChild(_0x34d827);
    const _0x358c69 = document.createElement('div');
    _0x358c69.id = "preview_" + _0x1b4456;
    _0x358c69.classList.add('w-full', "h-16", "rounded", "border", 'border-gray-300', 'bg-gray-100', "bg-center", 'bg-cover');
    _0x39e17e.appendChild(_0x358c69);
    const _0x27e791 = document.createElement("input");
    _0x27e791.type = "file";
    _0x27e791.accept = "image/*";
    _0x27e791.id = "fileInput_" + _0x1b4456;
    _0x27e791.style.display = "none";
    _0x27e791.addEventListener("change", _0x75ec3f => handleImageUpload(_0x1b4456, _0x75ec3f.target.files[0x0]));
    _0x39e17e.appendChild(_0x27e791);
    return _0x39e17e;
  }
  function isValidColor(_0x2b844a) {
    const _0x371742 = new Option().style;
    _0x371742.color = _0x2b844a;
    return _0x371742.color !== '';
  }
  function convertToHex(_0x454a82) {
    if (!_0x454a82) {
      return '#000000';
    }
    if (_0x454a82.startsWith('#')) {
      return _0x454a82;
    }
    try {
      const _0x370a92 = document.createElement('div');
      _0x370a92.style.color = _0x454a82;
      document.body.appendChild(_0x370a92);
      const _0x46b6fd = window.getComputedStyle(_0x370a92).color;
      document.body.removeChild(_0x370a92);
      const _0x5b3296 = _0x46b6fd.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (_0x5b3296) {
        const _0x387fe3 = parseInt(_0x5b3296[0x1]);
        const _0x12ed44 = parseInt(_0x5b3296[0x2]);
        const _0x5042c3 = parseInt(_0x5b3296[0x3]);
        return '#' + _0x387fe3.toString(0x10).padStart(0x2, '0') + _0x12ed44.toString(0x10).padStart(0x2, '0') + _0x5042c3.toString(0x10).padStart(0x2, '0');
      }
      return "#000000";
    } catch (_0xa59050) {
      return "#000000";
    }
  }
  function updatePreview(_0x21035f) {
    const _0x4240b0 = document.getElementById("projectorConfig_" + _0x21035f);
    const _0x29b925 = document.getElementById("preview_" + _0x21035f);
    const _0x221c32 = document.getElementById("deleteBtn_" + _0x21035f);
    const _0x500fa4 = document.getElementById("colorPicker_" + _0x21035f);
    if (!_0x4240b0 || !_0x29b925) {
      console.warn("Elements not found for key: " + _0x21035f);
      return;
    }
    const _0x5e727c = _0x4240b0.value.trim();
    if (!_0x5e727c) {
      _0x29b925.style.background = "#f3f4f6";
      _0x29b925.style.backgroundImage = "none";
      if (_0x221c32) {
        _0x221c32.style.display = 'none';
      }
      return;
    }
    try {
      _0x29b925.style.background = '';
      _0x29b925.style.backgroundImage = "none";
      _0x29b925.style.backgroundColor = '';
      if (_0x5e727c.startsWith("http") || _0x5e727c.includes('cloudinary.com') || _0x5e727c.startsWith('data:image')) {
        _0x29b925.style.backgroundImage = "url(" + _0x5e727c + ')';
        _0x29b925.style.backgroundSize = 'cover';
        _0x29b925.style.backgroundPosition = 'center';
        _0x29b925.style.backgroundRepeat = 'no-repeat';
        if (_0x221c32) {
          _0x221c32.style.display = _0x5e727c.includes("cloudinary.com") ? "inline-block" : "none";
        }
      } else {
        _0x29b925.style.background = _0x5e727c;
        if (_0x221c32) {
          _0x221c32.style.display = 'none';
        }
        if (_0x500fa4) {
          try {
            if (_0x5e727c.startsWith('#') && _0x5e727c.length === 0x7) {
              _0x500fa4.value = _0x5e727c;
            } else {
              if (isValidColor(_0x5e727c)) {
                const _0x262fbc = convertToHex(_0x5e727c);
                if (_0x262fbc && _0x262fbc.startsWith('#')) {
                  _0x500fa4.value = _0x262fbc;
                }
              }
            }
          } catch (_0x36fab9) {
            console.log("Color picker update error:", _0x36fab9);
          }
        }
      }
    } catch (_0x23dd9e) {
      console.error("Preview update error:", _0x23dd9e);
      _0x29b925.style.background = '#f3f4f6';
    }
  }
  function openImageUpload(_0x113574) {
    const _0x204889 = document.getElementById("fileInput_" + _0x113574);
    if (_0x204889) {
      _0x204889.click();
    }
  }
  async function handleImageUpload(_0x4a459c, _0xd59aff) {
    if (!_0xd59aff) {
      return;
    }
    const _0x2dcdf7 = firebase.auth().currentUser;
    if (!_0x2dcdf7) {
      failToast("Vui lòng đăng nhập để upload hình ảnh!", 0xbb8, "top", "right", true, false, '');
      return;
    }
    
    // Get elements
    const _0x1ea87e = document.getElementById("projectorConfig_" + _0x4a459c);
    const _0x5e5a1c = document.getElementById("fileInput_" + _0x4a459c);
    let _0xa2879d = null;
    
    // Find upload button by traversing from input element
    if (_0x1ea87e && _0x1ea87e.parentElement) {
      const container = _0x1ea87e.parentElement;
      const buttons = container.querySelectorAll('button');
      _0xa2879d = Array.from(buttons).find(btn => btn.textContent.includes('📷'));
    }
    
    try {
      // Show loading toast immediately
      const loadingToastId = Date.now();
      if (typeof showToast === "function") {
        showToast("⏳ Đang upload hình ảnh...", "info", 0, "top", "right", true, false, loadingToastId.toString());
      }
      
      // Update UI to show uploading state
      if (_0x1ea87e) {
        _0x1ea87e.value = "⏳ Đang upload...";
        _0x1ea87e.disabled = true;
      }
      
      // Disable upload button
      if (_0xa2879d) {
        _0xa2879d.disabled = true;
        _0xa2879d.classList.add('opacity-50', 'cursor-not-allowed');
        _0xa2879d.innerHTML = "⏳ Đang tải...";
      }
      
      // Force UI update before starting upload
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Upload file using Cloudinary
      const _0x53fd3f = Date.now();
      const _0x2147f9 = _0x4a459c + '_' + _0x53fd3f;
      const folder = "projectorConfig/" + _0x2dcdf7.uid;
      
      // Upload with progress tracking
      const uploadResult = await window.cloudinaryService.uploadFile(_0xd59aff, {
        folder: folder,
        publicId: _0x2147f9,
        onProgress: (progressData) => {
          // Update progress in UI
          if (_0x1ea87e && progressData.percent) {
            _0x1ea87e.value = `⏳ Đang upload... ${Math.round(progressData.percent)}%`;
          }
        }
      });
      
      // Get the download URL from upload result
      const _0x416be6 = uploadResult.url;
      
      // Update UI with result
      if (_0x1ea87e) {
        _0x1ea87e.value = _0x416be6;
        _0x1ea87e.disabled = false;
      }
      
      // Re-enable upload button
      if (_0xa2879d) {
        _0xa2879d.disabled = false;
        _0xa2879d.classList.remove('opacity-50', 'cursor-not-allowed');
        _0xa2879d.innerHTML = "📷 Upload";
      }
      
      updatePreview(_0x4a459c);
      
      // Reset file input
      if (_0x5e5a1c) {
        _0x5e5a1c.value = '';
      }
      
      // Close loading toast
      if (typeof closeToast === "function") {
        closeToast(loadingToastId.toString());
      }
      
      successToast("✅ Upload hình ảnh thành công!", 0xbb8, 'top', "right", true, false, '');
    } catch (_0x3e6cac) {
      console.error("Upload error:", _0x3e6cac);
      failToast("❌ Lỗi upload hình ảnh: " + _0x3e6cac.message, 0xbb8, "top", "right", true, false, '');
      
      // Reset UI on error
      const _0x4aebda = document.getElementById("projectorConfig_" + _0x4a459c);
      if (_0x4aebda) {
        _0x4aebda.value = '';
        _0x4aebda.disabled = false;
      }
      
      // Reset file input
      if (_0x5e5a1c) {
        _0x5e5a1c.value = '';
      }
      
      // Re-enable upload button
      if (_0xa2879d) {
        _0xa2879d.disabled = false;
        _0xa2879d.classList.remove('opacity-50', 'cursor-not-allowed');
        _0xa2879d.innerHTML = "📷 Upload";
      }
    }
  }
  async function deleteImage(_0x58a9f8) {
    const _0x1d057e = document.getElementById('projectorConfig_' + _0x58a9f8);
    if (!_0x1d057e) {
      return;
    }
    const _0x46cc41 = _0x1d057e.value.trim();
    
    // Check if it's a Cloudinary URL
    if (!_0x46cc41.includes("cloudinary.com")) {
      return;
    }
    
    const _0x4ace92 = await showCustomConfirm("Bạn có chắc chắn muốn xóa hình ảnh này?", "Xác nhận xóa hình ảnh", "Xóa", 'Hủy');
    if (!_0x4ace92) {
      return;
    }
    
    try {
      // Extract public ID from Cloudinary URL
      const publicId = window.cloudinaryService.extractPublicId(_0x46cc41);
      
      // Delete from Cloudinary (note: this requires server-side implementation)
      await window.cloudinaryService.deleteFile(publicId);
      
      // Clear the input and update preview
      _0x1d057e.value = '';
      updatePreview(_0x58a9f8);
      
      successToast("✅ Đã xóa hình ảnh!", 0xbb8, "top", "right", true, false, '');
    } catch (_0x17cde5) {
      console.error("Delete error:", _0x17cde5);
      failToast("❌ Lỗi xóa hình ảnh: " + _0x17cde5.message, 0xbb8, "top", "right", true, false, '');
    }
  }
  function openGradientHelper(_0x24e469) {
    const _0x1e0d03 = document.getElementById('projectorConfig_' + _0x24e469);
    if (!_0x1e0d03) {
      return;
    }
    const _0x558bf1 = document.createElement("div");
    _0x558bf1.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.7);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        z-index: 9999;\n    ";
    const _0x49690e = document.createElement('div');
    _0x49690e.style.cssText = "\n        background: white;\n        padding: 25px;\n        border-radius: 15px;\n        max-width: 800px;\n        max-height: 90vh;\n        overflow-y: auto;\n        box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n    ";
    _0x49690e.innerHTML = "\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;\">\n            <h3 style=\"margin: 0; color: #333; font-size: 20px;\">🌈 Gradient Builder</h3>\n            <button id=\"closeGradient\" style=\"background: none; border: none; font-size: 24px; cursor: pointer; color: #999;\">×</button>\n        </div>\n        \n        <!-- Quick Templates -->\n        <div style=\"margin-bottom: 20px;\">\n            <h4 style=\"margin-bottom: 10px; color: #555; font-size: 14px;\">📋 Mẫu có sẵn:</h4>\n            <div id=\"gradientTemplates\" style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;\">\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #667eea, #764ba2)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #667eea, #764ba2); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #f093fb, #f5576c)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #f093fb, #f5576c); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #4facfe, #00f2fe)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #4facfe, #00f2fe); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #43e97b, #38f9d7)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #43e97b, #38f9d7); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #fa709a, #fee140)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #fa709a, #fee140); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(135deg, #a8edea, #fed6e3)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(135deg, #a8edea, #fed6e3); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(90deg, #ff6b6b, #ffd93d)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(90deg, #ff6b6b, #ffd93d); cursor: pointer; border: 2px solid transparent;\"></div>\n                <div class=\"gradient-template\" data-gradient=\"linear-gradient(45deg, #ff9a56, #ff6b95)\" style=\"height: 40px; border-radius: 8px; background: linear-gradient(45deg, #ff9a56, #ff6b95); cursor: pointer; border: 2px solid transparent;\"></div>\n            </div>\n        </div>\n        \n        <hr style=\"border: none; height: 1px; background: #eee; margin: 20px 0;\">\n        \n        <!-- Custom Builder -->\n        <div style=\"margin-bottom: 20px;\">\n            <h4 style=\"margin-bottom: 15px; color: #555; font-size: 14px;\">🎨 Tạo gradient tùy chỉnh:</h4>\n            \n            <!-- Direction -->\n            <div style=\"margin-bottom: 15px;\">\n                <label style=\"display: block; margin-bottom: 5px; font-size: 12px; color: #666;\">Hướng:</label>\n                <select id=\"gradientDirection\" style=\"padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px;\">\n                    <option value=\"0deg\">→ Trái sang phải</option>\n                    <option value=\"90deg\">↓ Trên xuống dưới</option>\n                    <option value=\"180deg\">← Phải sang trái</option>\n                    <option value=\"270deg\">↑ Dưới lên trên</option>\n                    <option value=\"45deg\">↘ Chéo xuống phải</option>\n                    <option value=\"135deg\" selected>↘ Chéo xuống phải (135°)</option>\n                    <option value=\"225deg\">↖ Chéo lên trái</option>\n                    <option value=\"315deg\">↗ Chéo lên phải</option>\n                </select>\n            </div>\n            \n            <!-- Colors -->\n            <div style=\"margin-bottom: 15px;\">\n                <label style=\"display: block; margin-bottom: 8px; font-size: 12px; color: #666;\">Màu sắc:</label>\n                <div id=\"colorStopsContainer\" style=\"space-y: 10px;\">\n                    <div class=\"color-stop\" style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 8px;\">\n                        <input type=\"color\" value=\"#667eea\" style=\"width: 50px; height: 35px; border: none; border-radius: 4px; cursor: pointer;\">\n                        <span style=\"font-size: 12px; color: #888;\">0%</span>\n                        <button type=\"button\" class=\"remove-color\" style=\"background: #ff4757; color: white; border: none; border-radius: 3px; padding: 4px 8px; font-size: 10px; cursor: pointer;\">Xóa</button>\n                    </div>\n                    <div class=\"color-stop\" style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 8px;\">\n                        <input type=\"color\" value=\"#764ba2\" style=\"width: 50px; height: 35px; border: none; border-radius: 4px; cursor: pointer;\">\n                        <span style=\"font-size: 12px; color: #888;\">100%</span>\n                        <button type=\"button\" class=\"remove-color\" style=\"background: #ff4757; color: white; border: none; border-radius: 3px; padding: 4px 8px; font-size: 10px; cursor: pointer;\">Xóa</button>\n                    </div>\n                </div>\n                <button id=\"addColorStop\" style=\"background: #2ed573; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; margin-top: 5px;\">+ Thêm màu</button>\n            </div>\n            \n            <!-- Live Preview -->\n            <div style=\"margin-bottom: 15px;\">\n                <label style=\"display: block; margin-bottom: 5px; font-size: 12px; color: #666;\">Xem trước:</label>\n                <div id=\"gradientPreview\" style=\"width: 100%; height: 60px; border-radius: 8px; border: 1px solid #ddd; background: linear-gradient(135deg, #667eea, #764ba2);\"></div>\n            </div>\n            \n            <!-- CSS Output -->\n            <div style=\"margin-bottom: 20px;\">\n                <label style=\"display: block; margin-bottom: 5px; font-size: 12px; color: #666;\">CSS Code:</label>\n                <textarea id=\"gradientCSS\" readonly style=\"width: 100%; height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 11px; background: #f8f9fa; resize: none;\">linear-gradient(135deg, #667eea, #764ba2)</textarea>\n            </div>\n        </div>\n        \n        <!-- Actions -->\n        <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <button id=\"randomGradient\" style=\"background: #ff6b6b; color: white; border: none; border-radius: 6px; padding: 10px 15px; font-size: 13px; cursor: pointer;\">🎲 Random</button>\n            <div>\n                <button id=\"cancelGradient\" style=\"background: #ddd; color: #666; border: none; border-radius: 6px; padding: 10px 15px; font-size: 13px; cursor: pointer; margin-right: 10px;\">Hủy</button>\n                <button id=\"applyGradient\" style=\"background: #2ed573; color: white; border: none; border-radius: 6px; padding: 10px 15px; font-size: 13px; cursor: pointer;\">✓ Áp dụng</button>\n            </div>\n        </div>\n    ";
    _0x558bf1.appendChild(_0x49690e);
    document.body.appendChild(_0x558bf1);
    initializeGradientBuilder(_0x558bf1, _0x1e0d03, _0x24e469);
  }
  function initializeGradientBuilder(_0x43d138, _0x5bff90, _0x4dd45f) {
    const _0x44b085 = _0x43d138.querySelector("#gradientDirection");
    const _0x114337 = _0x43d138.querySelector("#colorStopsContainer");
    const _0x2d6a0f = _0x43d138.querySelector("#gradientPreview");
    const _0xe86c52 = _0x43d138.querySelector("#gradientCSS");
    const _0x1ea0f5 = _0x43d138.querySelector("#addColorStop");
    const _0x3bcc88 = _0x43d138.querySelector("#randomGradient");
    const _0x2502d9 = _0x43d138.querySelector("#cancelGradient");
    const _0x49805b = _0x43d138.querySelector("#applyGradient");
    const _0x3dcb3d = _0x43d138.querySelector("#closeGradient");
    function _0x4101bb() {
      const _0x213d27 = _0x44b085.value;
      const _0x1033cd = Array.from(_0x114337.querySelectorAll('.color-stop')).map((_0x459fa0, _0x1704ff, _0x2e44f5) => {
        const _0x1b3b41 = _0x459fa0.querySelector("input[type=\"color\"]").value;
        const _0x2bd83c = Math.round(_0x1704ff / (_0x2e44f5.length - 0x1) * 0x64);
        _0x459fa0.querySelector("span").textContent = _0x2bd83c + '%';
        return _0x1b3b41 + " " + _0x2bd83c + '%';
      });
      const _0x56e373 = "linear-gradient(" + _0x213d27 + ", " + _0x1033cd.join(", ") + ')';
      _0x2d6a0f.style.background = _0x56e373;
      _0xe86c52.value = _0x56e373;
    }
    function _0x279720(_0xfdec69 = '#ffffff') {
      const _0x314862 = document.createElement("div");
      _0x314862.className = 'color-stop';
      _0x314862.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";
      _0x314862.innerHTML = "\n            <input type=\"color\" value=\"" + _0xfdec69 + "\" style=\"width: 50px; height: 35px; border: none; border-radius: 4px; cursor: pointer;\">\n            <span style=\"font-size: 12px; color: #888;\">50%</span>\n            <button type=\"button\" class=\"remove-color\" style=\"background: #ff4757; color: white; border: none; border-radius: 3px; padding: 4px 8px; font-size: 10px; cursor: pointer;\">Xóa</button>\n        ";
      _0x114337.appendChild(_0x314862);
      _0x314862.querySelector("input[type=\"color\"]").addEventListener('input', _0x4101bb);
      _0x314862.querySelector(".remove-color").addEventListener("click", () => {
        if (_0x114337.children.length > 0x2) {
          _0x314862.remove();
          _0x4101bb();
        }
      });
      _0x4101bb();
    }
    _0x44b085.addEventListener("change", _0x4101bb);
    _0x114337.querySelectorAll("input[type=\"color\"]").forEach(_0x4b7905 => {
      _0x4b7905.addEventListener("input", _0x4101bb);
    });
    _0x114337.querySelectorAll(".remove-color").forEach(_0x1d753f => {
      _0x1d753f.addEventListener("click", _0x254bad => {
        if (_0x114337.children.length > 0x2) {
          _0x254bad.target.closest(".color-stop").remove();
          _0x4101bb();
        }
      });
    });
    _0x1ea0f5.addEventListener("click", () => _0x279720());
    _0x3bcc88.addEventListener("click", () => {
      const _0x1c9874 = ["#ff6b6b", '#ffd93d', '#6bcf7f', "#4d96ff", "#9c88ff", "#ff9ff3", '#54a0ff', "#5f27cd"];
      const _0x1bc024 = Math.floor(Math.random() * 0x3) + 0x2;
      _0x114337.innerHTML = '';
      for (let _0x4aae8b = 0x0; _0x4aae8b < _0x1bc024; _0x4aae8b++) {
        const _0x5cead6 = _0x1c9874[Math.floor(Math.random() * _0x1c9874.length)];
        _0x279720(_0x5cead6);
      }
      const _0x36269d = ["0deg", "45deg", "90deg", "135deg", "180deg", "225deg", "270deg", "315deg"];
      _0x44b085.value = _0x36269d[Math.floor(Math.random() * _0x36269d.length)];
      _0x4101bb();
    });
    _0x43d138.querySelectorAll(".gradient-template").forEach(_0x35e12b => {
      _0x35e12b.addEventListener("click", () => {
        const _0x14364a = _0x35e12b.dataset.gradient;
        _0x5bff90.value = _0x14364a;
        updatePreview(_0x4dd45f);
        document.body.removeChild(_0x43d138);
      });
      _0x35e12b.addEventListener("mouseenter", () => {
        _0x35e12b.style.border = "2px solid #007cba";
        _0x35e12b.style.transform = "scale(1.05)";
      });
      _0x35e12b.addEventListener("mouseleave", () => {
        _0x35e12b.style.border = "2px solid transparent";
        _0x35e12b.style.transform = 'scale(1)';
      });
    });
    _0x49805b.addEventListener("click", () => {
      _0x5bff90.value = _0xe86c52.value;
      updatePreview(_0x4dd45f);
      document.body.removeChild(_0x43d138);
    });
    [_0x2502d9, _0x3dcb3d].forEach(_0x418de9 => {
      _0x418de9.addEventListener("click", () => {
        document.body.removeChild(_0x43d138);
      });
    });
    _0x43d138.addEventListener("click", _0x5e87d3 => {
      if (_0x5e87d3.target === _0x43d138) {
        document.body.removeChild(_0x43d138);
      }
    });
    _0x4101bb();
  }
  let themesLoaded = false;
  function showCustomAlert(_0x3a21a4, _0x23895e = "Thông báo", _0xe71600 = 'info') {
    return new Promise(_0x183875 => {
      const _0x1bd759 = document.createElement("div");
      _0x1bd759.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0,0,0,0.6);\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            z-index: 10000;\n            backdrop-filter: blur(4px);\n        ";
      const _0x13e8b3 = document.createElement("div");
      _0x13e8b3.classList.add('relative', "mx-auto", "w-full", "max-w-md", 'rounded-xl', 'bg-white', "dark:bg-neutral-900", "shadow-xl", "border", "border-gray-200", "dark:border-gray-700");
      const _0x420ba9 = _0xe71600 === "success" ? '✅' : _0xe71600 === 'error' ? '❌' : 'ℹ️';
      _0x13e8b3.innerHTML = "\n            <div class=\"p-6\">\n                <div class=\"flex items-center mb-4\">\n                    <div style=\"font-size: 24px; margin-right: 12px;\">" + _0x420ba9 + "</div>\n                    <h3 class=\"text-lg font-bold text-gray-900 dark:text-white\">" + _0x23895e + "</h3>\n                </div>\n                <p class=\"text-gray-600 dark:text-gray-300 font-semibold leading-relaxed mb-6\">" + _0x3a21a4 + "</p>\n                <div class=\"flex justify-end\">\n                    <button id=\"alertOkBtn\" class=\"px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\">\n                        Đóng\n                    </button>\n                </div>\n            </div>\n        ";
      _0x1bd759.appendChild(_0x13e8b3);
      document.body.appendChild(_0x1bd759);
      _0x13e8b3.style.transform = "scale(0.9)";
      _0x13e8b3.style.opacity = '0';
      setTimeout(() => {
        _0x13e8b3.style.transition = "all 0.3s ease";
        _0x13e8b3.style.transform = "scale(1)";
        _0x13e8b3.style.opacity = '1';
      }, 0xa);
      const _0x1fd7f7 = () => {
        _0x13e8b3.style.transform = "scale(0.9)";
        _0x13e8b3.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(_0x1bd759);
          _0x183875(true);
        }, 0xc8);
      };
      _0x13e8b3.querySelector("#alertOkBtn").addEventListener("click", _0x1fd7f7);
      _0x1bd759.addEventListener("click", _0x5cf223 => {
        if (_0x5cf223.target === _0x1bd759) {
          _0x1fd7f7();
        }
      });
      setTimeout(() => {
        _0x13e8b3.querySelector("#alertOkBtn").focus();
      }, 0x12c);
    });
  }
  function showCustomConfirm(_0x3ec172, _0x24f31e = "Xác nhận", _0x56c83b = "Xác nhận", _0x40d3ee = "Hủy") {
    return new Promise(_0x181c0b => {
      const _0x5dac77 = document.createElement("div");
      _0x5dac77.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0,0,0,0.6);\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            z-index: 10000;\n            backdrop-filter: blur(4px);\n        ";
      const _0x42d079 = document.createElement('div');
      _0x42d079.classList.add("relative", "mx-auto", "w-full", 'max-w-md', "rounded-xl", "bg-white", "dark:bg-neutral-900", 'shadow-xl', 'border', "border-gray-200", "dark:border-gray-700");
      _0x42d079.innerHTML = "\n            <div class=\"p-6\">\n                <div class=\"flex items-center mb-4\">\n                    <div style=\"font-size: 24px; margin-right: 12px;\">❓</div>\n                    <h3 class=\"text-lg font-semibold text-gray-900 dark:text-white\">" + _0x24f31e + "</h3>\n                </div>\n                <p class=\"text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium\">" + _0x3ec172 + "</p>\n                <div class=\"flex justify-end space-x-3\">\n                    <button id=\"confirmCancelBtn\" class=\"px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2\">\n                        " + _0x40d3ee + "\n                    </button>\n                    <button id=\"confirmOkBtn\" class=\"px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\">\n                        " + _0x56c83b + "\n                    </button>\n                </div>\n            </div>\n        ";
      _0x5dac77.appendChild(_0x42d079);
      document.body.appendChild(_0x5dac77);
      _0x42d079.style.transform = 'scale(0.9)';
      _0x42d079.style.opacity = '0';
      setTimeout(() => {
        _0x42d079.style.transition = "all 0.3s ease";
        _0x42d079.style.transform = 'scale(1)';
        _0x42d079.style.opacity = '1';
      }, 0xa);
      const _0x372518 = _0x1f0cb8 => {
        _0x42d079.style.transform = "scale(0.9)";
        _0x42d079.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(_0x5dac77);
          _0x181c0b(_0x1f0cb8);
        }, 0xc8);
      };
      _0x42d079.querySelector("#confirmOkBtn").addEventListener('click', () => _0x372518(true));
      _0x42d079.querySelector("#confirmCancelBtn").addEventListener('click', () => _0x372518(false));
      _0x5dac77.addEventListener("click", _0x57684b => {
        if (_0x57684b.target === _0x5dac77) {
          _0x372518(false);
        }
      });
      setTimeout(() => {
        _0x42d079.querySelector("#confirmOkBtn").focus();
      }, 0x12c);
      const _0x20ebc0 = _0x41e14e => {
        if (_0x41e14e.key === 'Escape') {
          document.removeEventListener("keydown", _0x20ebc0);
          _0x372518(false);
        }
      };
      document.addEventListener("keydown", _0x20ebc0);
    });
  }
  async function initializeProjectorConfig() {
    const _0x8e256c = document.getElementById("projectorConfigContainer");
    if (!_0x8e256c || themesLoaded) {
      return Promise.resolve();
    }
    _0x8e256c.classList.add("w-full", "p-4", 'space-y-6');
    _0x8e256c.innerHTML = "\n        <div class=\"flex items-center justify-center py-8\">\n            <div class=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500\"></div>\n            <span class=\"ml-3 text-gray-600 dark:text-gray-400\">Đang tải giao diện...</span>\n        </div>\n    ";
    try {
      await fetchThemesFromFirestore();
      _0x8e256c.innerHTML = '';
      createTemplatesSection(_0x8e256c);
      Object.keys(configGroups).forEach(_0x570d61 => {
        const _0x2a40ea = document.createElement("div");
        _0x2a40ea.classList.add('space-y-4');
        const _0x4697b3 = document.createElement('h2');
        _0x4697b3.textContent = _0x570d61;
        _0x4697b3.classList.add("text-lg", "font-semibold", "text-slate-700", 'dark:text-white');
        _0x2a40ea.appendChild(_0x4697b3);
        Object.entries(configGroups[_0x570d61]).forEach(([_0x4ccae5, _0x2af25f]) => {
          const _0x29b96b = document.createElement('div');
          _0x29b96b.classList.add('space-y-2');
          const _0x3e2baa = document.createElement('label');
          _0x3e2baa.textContent = _0x2af25f;
          _0x3e2baa.classList.add("block", 'text-sm', "font-medium", "text-slate-700", 'dark:text-white');
          _0x29b96b.appendChild(_0x3e2baa);
          const _0x5a0691 = createSimplifiedControl(_0x4ccae5, _0x2af25f);
          _0x29b96b.appendChild(_0x5a0691);
          _0x2a40ea.appendChild(_0x29b96b);
        });
        _0x8e256c.appendChild(_0x2a40ea);
      });
      themesLoaded = true;
      const _0x21d6a8 = firebase.auth().currentUser;
      if (_0x21d6a8) {
        restoreConfig(_0x21d6a8.uid);
      } else if (window.pendingConfigRestore) {
        restoreConfig(window.pendingConfigRestore);
        delete window.pendingConfigRestore;
      }
      return Promise.resolve();
    } catch (_0x2d3e1d) {
      console.error("Error initializing projector config:", _0x2d3e1d);
      _0x8e256c.innerHTML = "\n            <div class=\"text-center py-8\">\n                <p class=\"text-red-600 dark:text-red-400\">Lỗi tải giao diện. Vui lòng thử lại.</p>\n                <button onclick=\"location.reload()\" class=\"mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600\">\n                    Tải lại\n                </button>\n            </div>\n        ";
      return Promise.reject(_0x2d3e1d);
    }
  }
  firebase.auth().onAuthStateChanged(_0x26c009 => {
    if (!_0x26c009) {
      return;
    }
    if (themesLoaded) {
      restoreConfig(_0x26c009.uid);
    } else {
      window.pendingConfigRestore = _0x26c009.uid;
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const _0x5205af = document.getElementById("saveAllConfig");
    const _0x46c796 = document.getElementById('downloadConfig');
    const _0x3196af = document.getElementById("restoreConfig");
    const _0x168a97 = document.getElementById("configFileInput");
    const _0x339d9e = document.getElementById("deleteConfig");
    if (_0x5205af) {
      _0x5205af.addEventListener("click", saveConfig);
    }
    if (_0x46c796) {
      _0x46c796.addEventListener('click', downloadConfig);
    }
    if (_0x3196af) {
      _0x3196af.addEventListener("click", () => _0x168a97.click());
    }
    if (_0x168a97) {
      _0x168a97.addEventListener("change", uploadConfigFile);
    }
    if (_0x339d9e) {
      _0x339d9e.addEventListener("click", clearAllConfig);
    }
  });
  function saveConfig() {
    const _0x580e93 = firebase.auth().currentUser;
    if (!_0x580e93) {
      return;
    }
    const _0x565635 = {};
    Object.keys(configGroups).forEach(_0x56ab66 => {
      Object.keys(configGroups[_0x56ab66]).forEach(_0x200aa4 => {
        const _0x1170d0 = document.getElementById('projectorConfig_' + _0x200aa4);
        if (_0x1170d0) {
          _0x565635[_0x200aa4] = _0x1170d0.value;
        }
      });
    });
    firebase.firestore().collection("projectorConfig").doc(_0x580e93.uid).set({
      'configData': _0x565635
    }, {
      'merge': true
    });
    successToast("Đã lưu cấu hình máy chiếu!", 0xbb8, "top", "right", true, false, '');
  }
  function downloadConfig() {
    const _0x1673de = {};
    Object.keys(configGroups).forEach(_0x47165e => {
      Object.keys(configGroups[_0x47165e]).forEach(_0x426647 => {
        const _0x2b16f8 = document.getElementById("projectorConfig_" + _0x426647);
        if (_0x2b16f8) {
          _0x1673de[_0x426647] = _0x2b16f8.value;
        }
      });
    });
    const _0x2236e2 = new Blob([JSON.stringify(_0x1673de, null, 0x2)], {
      'type': "application/json"
    });
    const _0x5936c1 = document.createElement('a');
    _0x5936c1.href = URL.createObjectURL(_0x2236e2);
    _0x5936c1.download = "config.json";
    document.body.appendChild(_0x5936c1);
    _0x5936c1.click();
    document.body.removeChild(_0x5936c1);
  }
  function restoreConfig(_0x400b80) {
    firebase.firestore().collection("projectorConfig").doc(_0x400b80).onSnapshot(_0xe08ff5 => {
      if (_0xe08ff5.exists) {
        const _0x85f5fd = _0xe08ff5.data().configData || {};
        if (!themesLoaded) {
          console.log("Waiting for themes to load before restoring config...");
          return;
        }
        setTimeout(() => {
          let _0x1d1571 = 0x0;
          Object.keys(_0x85f5fd).forEach(_0x10ba19 => {
            const _0x425d39 = document.getElementById("projectorConfig_" + _0x10ba19);
            if (_0x425d39 && _0x85f5fd[_0x10ba19]) {
              _0x425d39.value = _0x85f5fd[_0x10ba19];
              updatePreview(_0x10ba19);
              _0x1d1571++;
            }
          });
          if (_0x1d1571 > 0x0) {
            console.log("Restored " + _0x1d1571 + " configuration items from Firestore");
          }
        }, 0x64);
      }
    });
  }
  function uploadConfigFile(_0x287469) {
    const _0x2d9782 = _0x287469.target.files[0x0];
    if (!_0x2d9782) {
      return;
    }
    const _0x430f5a = new FileReader();
    _0x430f5a.onload = function (_0xa9fe8f) {
      try {
        const _0x535ce7 = JSON.parse(_0xa9fe8f.target.result);
        Object.keys(_0x535ce7).forEach(_0x445dcd => {
          const _0xf3765a = document.getElementById("projectorConfig_" + _0x445dcd);
          if (_0xf3765a && _0x535ce7[_0x445dcd]) {
            _0xf3765a.value = _0x535ce7[_0x445dcd];
            updatePreview(_0x445dcd);
          }
        });
        successToast("Đã khôi phục cấu hình máy chiếu!", 0xbb8, "top", "right", true, false, '');
      } catch (_0x28d327) {
        console.error("Upload config error:", _0x28d327);
        failToast("Không thể khôi phục cấu hình máy chiếu!", 0xbb8, "top", "right", true, false, '');
      }
    };
    _0x430f5a.readAsText(_0x2d9782);
  }
  async function clearAllConfig() {
    const _0x1bb049 = await showCustomConfirm("Bạn có chắc chắn muốn xóa tất cả cấu hình?", "Xác nhận xóa cấu hình", "Xóa tất cả", 'Hủy');
    if (_0x1bb049) {
      Object.keys(configGroups).forEach(_0x321f39 => {
        Object.keys(configGroups[_0x321f39]).forEach(_0x553ed2 => {
          const _0x1b0792 = document.getElementById('projectorConfig_' + _0x553ed2);
          if (_0x1b0792) {
            _0x1b0792.value = '';
          }
          updatePreview(_0x553ed2);
        });
      });
      const _0x2d2600 = firebase.auth().currentUser;
      if (_0x2d2600) {
        firebase.firestore().collection("projectorConfig").doc(_0x2d2600.uid).update({
          'configData': {}
        });
        successToast("Đã xóa tất cả cấu hình!", 0xbb8, 'top', "right", true, false, '');
      }
    }
  }