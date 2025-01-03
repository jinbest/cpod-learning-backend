import isChinese from 'is-chinese'
import convertPinyinTones from 'pinyin-tone-converter'

const cleanDefinitions = (definitionString) => {
  let definitions = definitionString.split('/');
  let cleanedData = [];
  definitions.forEach(definition => {
    let type; let splitter;
    if (definition.startsWith('see also ')) {
      type = 'see also';
      splitter = 'see also ';
    } else if (definition.startsWith('see ')) {
      type = 'see also';
      splitter = 'see ';
    } else if (definition.startsWith('CL:')) {
      type = 'classifier';
      splitter = 'CL:';
    } else if (definition.startsWith('variant of ')) {
      type = 'variant';
      splitter = 'variant of '
    } else if (definition.startsWith('same as ')) {
      type = 'same as';
      splitter = 'same as '
    } else if (definition.startsWith('erhua variant of ')) {
      type = 'erhua variant';
      splitter = 'erhua variant of '
    }

    if(type) {
      definition = definition.replace(splitter, '');
      let definitionPieces = definition.split(',');
      definition = [];
      definitionPieces.forEach(piece => {
        let simplified; let traditional; let chinese; let pinyin;
        [chinese, pinyin] = piece.split(/\[(.*)]/);
        let characters = chinese.split('|');
        if (characters.length > 1) {
          simplified = characters[1];
          traditional = characters[0];
        } else {
          simplified = characters[0];
          traditional = characters[0];
        }
        if(isChinese(simplified) && isChinese(traditional)) {
          definition.push({type: type, simplified: simplified, traditional: traditional, pinyin: pinyin})
        } else {
          definition.push(piece)
        }
      });
    }

    if(Array.isArray(definition)) {
      cleanedData = cleanedData.concat(definition)
    } else {
      cleanedData.push(definition)
    }

  })

  return cleanedData
}

const cleanPinyin = (pinyinString) => {
  return pinyinString
    ? convertPinyinTones(pinyinString)
      .replace(new RegExp('/\&#039;', 'g'), '\'')
      .replace(new RegExp('&#039;', 'g'), '\'')
      .replace(new RegExp('n5', 'g'), 'n')
      .replace(new RegExp('r5', 'g'), 'r')
      .replace(new RegExp('u:1', 'g'),'ǖ')
      .replace(new RegExp('u:2', 'g'),'ǘ')
      .replace(new RegExp('u:3', 'g'),'ǚ')
      .replace(new RegExp('u:4', 'g'),'ǜ')
      .replace(new RegExp('u:5', 'g'),'ü')
    : ''
}

const multipleDefinitions = (definitionString) => {
  return definitionString.split('/').length > 1 || definitionString.split('[').length > 1
}

const checkDecomposition = (component) => {
  return isChinese(component)
    && component !== 'No glyph available'
    && !new RegExp(
      `[!"\#$%&'()*+,\-./:;<=>?@\[\\\]^_\`{|}~、，。：·～！¥…（）—；【】「」《》？ˋ．・]|\\s|[A-z]|[0-9]|\\d+`
    ).test(component)
}

const cleanDecomposition = (array) => {
  return array.filter(component => {
    return isChinese(component)
      && component !== 'No glyph available'
      && !new RegExp(
        `[!"\#$%&'()*+,\-./:;<=>?@\[\\\]^_\`{|}~、，。：·～！¥…（）—；【】「」《》？ˋ．・]|\\s|[A-z]|[0-9]|\\d+`
      ).test(component)
  })
}


export {
  cleanDefinitions,
  cleanPinyin,
  multipleDefinitions,
  cleanDecomposition,
  checkDecomposition
}
