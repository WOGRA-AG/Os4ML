from components.create_databag.main import main as main1
from components.get_databag.main import main as main2
from components.get_metrics.main import main as main3
from components.init_databag.main import main as main4
from components.katib_solver.main import main as main5
from components.ludwig_solver.main import main as main6
from components.preprocess_data.main import main as main7
from components.sniffle_dataset.main import main as main8
from components.train_random_forest.main import main as main9
from components.update_databag_status.main import main as main10
from components.update_status.main import main as main11
from components.upload_to_objectstore.main import main as main12

if __name__ == '__main__':
    main1()
    main2()
    main3()
    main4()
    main5()
    main6()
    main7()
    main8()
    main9()
    main10()
    main11()
    main12()
