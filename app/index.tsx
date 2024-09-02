import { CircularButton } from '@/components/CircularButton';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

let math = require('mathjs');

enum OperationsEnum {
  "ADD" = '+',
  "SUBTRACT" = "-",
  "MULTIPLY" = "*",
  "DIVIDE" = "/"
}

const numbers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

export default function HomeScreen() {
  const [display, setDisplay] = useState<string>('0')
  const [mode, setMode] = useState<'input' | 'operation' | undefined>('input')
  const [currentlySelectedOperation, setCurrentlySelectedOperation] = useState<undefined | OperationsEnum>(undefined)
  const [lastTotal, setLastTotal] = useState<string | undefined>(undefined)
  const [entries, setEntries] = useState<string[]>([])
  const [currentInputString, setCurrentInputString] = useState<string>('')
  const operations = [
    {operation: OperationsEnum.DIVIDE, display: '÷'},
    {operation: OperationsEnum.MULTIPLY, display: "×"},
    {operation: OperationsEnum.SUBTRACT, display: "-"},
    {operation: OperationsEnum.ADD, display: "+"},
  ]
  const getEntriesToEvaluate = (entriesPassed: string[]) => {
    const ops: string[]= [OperationsEnum.ADD, OperationsEnum.SUBTRACT, OperationsEnum.DIVIDE, OperationsEnum.MULTIPLY]
    const last = entriesPassed[entriesPassed.length - 1]
    if(typeof parseFloat(last) !== 'number'){
      return entriesPassed.slice(0, -1)
    }
    return entriesPassed
  }
  const getTotal = (entriesPassed: string[]) => {
    // if last entry is operation, slice it off
    const entriesToEval = getEntriesToEvaluate(entriesPassed)
    const string = entriesToEval.join(' ')
    const total = math.evaluate(string)
    return total
  }
  useEffect(() => {
    console.log(entries);
  }, [entries])
  useEffect(() => {
    console.log(currentInputString)
  }, [currentInputString])
  const handleEqualPress = () => {
    setMode(undefined)

    // update display
    const updatedEntries = [...entries, currentInputString]
    const total = getTotal(updatedEntries)
    setEntries([total])
    setLastTotal(total)
    setDisplay(total)
  }
  const onPressClear = () => {
    setCurrentInputString('')
    setEntries([])
    setMode('input')
    setCurrentlySelectedOperation(undefined)
    setDisplay('0')
    setLastTotal(undefined)
  }
  const onPressPercent = () => {
    const inputStringAsNum = parseFloat(currentInputString)
    if(currentInputString === ''){
      if(lastTotal){
        const val = String(parseFloat(lastTotal) * 0.01)
        setCurrentInputString(val)
        setDisplay(val)
      }
      return
    } else {
      const val = String(inputStringAsNum * 0.01)
      setCurrentInputString(val)
      setDisplay(val)
    }
  }
  const onPressSignChange = () => {
    let valueToUse
    if(lastTotal && mode === undefined){
      valueToUse = parseFloat(lastTotal)
    } else {
      valueToUse = parseFloat(currentInputString)
    }
    const val = String(valueToUse * -1)
    setCurrentInputString(val)
    setDisplay(val)
  }

  const handleDisplayUpdate = (selectedOp: OperationsEnum, currEntries: string[]) => {
    if(selectedOp === OperationsEnum.ADD || selectedOp === OperationsEnum.SUBTRACT){
      setDisplay(getTotal(currEntries))
    } else {
      setDisplay(currEntries[currEntries.length - 1])
    }
  }
  const handleOperationPress = (op: {operation: OperationsEnum, display: string}) => {
    // current mode is input, need to update
    if(mode === 'input'){
      console.log('current mode is input, pressed op', op)
      const updatedEntries = [...entries, currentInputString]
      // push the current input to the array of entries
      setEntries(updatedEntries)
      setMode('operation')
      setCurrentlySelectedOperation(op.operation)
      setCurrentInputString('')
      // evaluate existing entries
      if(updatedEntries.length > 1){
        handleDisplayUpdate(op.operation, updatedEntries)
      } else {
        setDisplay(updatedEntries[0])
      }
    } else if (mode === 'operation'){
      setCurrentlySelectedOperation(op.operation)
      // if selected operation is plus or minus, show last total
      handleDisplayUpdate(op.operation, entries)
    } else {
      // TODO
    }
  }
  const handleNumberButtonPress = (num: string) => {
    if(mode === 'input'){
      const newVal = currentInputString + num
      setCurrentInputString(newVal)
      setDisplay(newVal)
    } else if(mode === 'operation'){
      // change mode
      console.log('current mode is,', mode)
      if(currentlySelectedOperation){
        setEntries([...entries, currentlySelectedOperation as string])
      }
      setCurrentlySelectedOperation(undefined)
      setMode('input')
      setCurrentInputString(num)
      setDisplay(num)
    } else {
      // TODO
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputViewContainer}>
        <View style={styles.inputViewInner}>
          <Text style={styles.displayText}>{display}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsLeft}>
          <View style={styles.topButtons}>
            <CircularButton display="C" onPress={onPressClear}/>
            <CircularButton display="+ / -" onPress={onPressSignChange}/>
            <CircularButton display="%" onPress={onPressPercent}/>
          </View>
          <View style={styles.numberButtons}>
            {numbers.map((num) => {
              return (
                <CircularButton display={num.toString()} key={`number-btn-${num}`} onPress={() => {
                  handleNumberButtonPress(num.toString())
                }}/>
              )
            })}
            <CircularButton display='.' onPress={() => {
              handleNumberButtonPress('.')
            }}/>
          </View>
        </View>
        <View style={styles.buttonsRight}>
          {operations.map((op) => {
            return (
            <TouchableOpacity 
              key={`op-btn-${op.display}`}
              style={[styles.operationButton, currentlySelectedOperation === op.operation && styles.selected]}
              onPress={() => handleOperationPress(op)}
            >
              <Text style={[styles.opButtonText, currentlySelectedOperation === op.operation && styles.opButtonTextSelected]}>{op.display}</Text>
            </TouchableOpacity>)
          })}
          <TouchableOpacity 
              style={styles.operationButton}
              onPress={() => handleEqualPress()}
            >
              <Text style={styles.opButtonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#64c4c0',
    flex: 1,
    justifyContent: 'flex-end'
  },
  inputViewContainer: {
    flex: 1,
    padding: 30,
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  },
  displayText: {
    fontSize: 60,
    textAlign: 'right'
  },
  inputViewInner: {
    backgroundColor: '#c9cdd4',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10
  },
  buttonsContainer: {
    flex: 4,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  buttonsLeft: {
    flex: 3,
  },
  buttonsRight: {
    // flex: 1
    paddingHorizontal: 10,
    rowGap: 10,
  },
  topButtons: {
    flexDirection: 'row',
    columnGap: 20,
    marginBottom: 10,
    justifyContent: 'center'
  },
  numberButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignContent: 'space-between',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 20
  },
  operationButton: {
    backgroundColor: 'orange',
    borderRadius: 100,
    minHeight: 70,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opButtonText: {
    fontSize: 30,
    color: 'white'
  },
  selected: {
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'white',
  },
  opButtonTextSelected: {
    color: 'orange'
  }
});
